"use strict"

var ValidationModel = require('imvalid');


//helper functions
function getConstructor(propConfig) {
	if(propConfig && propConfig.type){
		if(typeof propConfig.type !== "string"){
			return propConfig.type;
		}
		let propConstructor = propConfig.type;
		let propDefaultValue = propConfig.value;
		//setting up the appropriate constructor
		if(propConstructor.indexOf('.')!==-1 || typeof global[propConstructor] !== "function")
			propConstructor = localrequire(`backend.models.${propConstructor}.model`);
		else
			propConstructor = global[propConstructor];

		//If you set the value explicitly to null, than it won't create the object. Else the nested object will be created
		return propConstructor;
	}
	else{
		throw new Error(`property must have a type`);
	}
}

//base model is extracted from validation model
class BaseModel extends ValidationModel {

	/**
	 * Constructor for the models
	 * @param  {Object} obj An optional parameter to initiate properties
	 * @return {Void}     
	 */
	constructor(obj){
		super(obj);
		this.beforeSetup.apply(this,arguments);
		this.setupProperties.apply(this,arguments);
		this.setupValidations.apply(this,arguments);
	}

	/**
	 * A hook to ran before setup property etc
	 * @param  {Object} obj 
	 * @return {Void}     
	 */
	beforeSetup(obj){

	}

	/**
	 * it will setup the required properties as given in /models/modelName/properties.json
	 * @param  {Object} obj this is an optional param. If it's provided the value will be taken from this, else the default value from properties.json
	 * @return {Void}     
	 */
	setupProperties(obj){
		let properties = this.getProperties();

		//setting up the properties from property config
		if(properties && properties.properties){
			let propertyInfos = properties.properties;
			for(let propConfigName in propertyInfos){
				if(!propertyInfos.hasOwnProperty(propConfigName))
					continue;

				let propConfig = propertyInfos[propConfigName];
				let propConstructor = getConstructor(propConfig);
				let propDefaultValue = propConfig.value;
				let givenValue = propDefaultValue;
				if(obj!==undefined){
					if(obj===null)
						givenValue = null;
					else
						givenValue = obj[propConfigName];
				}

				if(givenValue!==null){
					if(!propConfig.isArray)
						this[propConfigName] = (givenValue || givenValue===0) ? new propConstructor(givenValue).valueOf() : new propConstructor().valueOf();
					else{
						let arr = [];
						if(Array.isArray(givenValue)){
							givenValue.forEach(function (value) {
								arr.push((value || value===0) ? new propConstructor(value).valueOf() : new propConstructor().valueOf());
							})
						}
						this[propConfigName]=arr;
					}
				}
				else{
					this[propConfigName] = null;
				}

			}
		}
	}

	/**
	 * As the model object is extended from ValidationModel, so setting up the validation property is necessary
	 * @return {[type]} [description]
	 */
	setupValidations(){
		let validations = this.getValidations();
		if(validations && validations.api){
			this.validations = validations.api.clone();
		}
	}

	/**
	 * This will load the properties from the given object considering the object as an ui model
	 * @param  {Object} obj - the ui model
	 * @return {Void}     it will load the property values in itself
	 */
	importFromUIModel(obj){
		let properties = this.getProperties();
		let appProperties = properties.properties;
		let uiMap = properties.uiMap;

		let iterableObj = (uiMap || appProperties);
		for(var propName in iterableObj){
			if(!obj.hasOwnProperty(propName) || !iterableObj.hasOwnProperty(propName) || typeof obj[propName] === "function")
				continue;
			
			let appPropertyName = uiMap ? uiMap[propName] : propName;
			let uiPropertyValue = obj[propName];

			let propConfig = appProperties[appPropertyName];
			let propConstructor = getConstructor(propConfig);

			if(uiPropertyValue!==null){
				if(!propConfig.isArray){
					let childAppObj = new propConstructor().valueOf();
					if(propConstructor===Date){
						childAppObj = new propConstructor();
					}
					this[appPropertyName] = (typeof childAppObj.importFromUIModel === "function") ? childAppObj.importFromUIModel(uiPropertyValue) : new propConstructor(uiPropertyValue).valueOf();
				}
				else{
					let arr = [];
					if(Array.isArray(uiPropertyValue)){
						uiPropertyValue.forEach(function (value) {
							let childAppObj = new propConstructor().valueOf();
							if(propConstructor===Date){
								childAppObj = new propConstructor();
							}
							arr.push((typeof childAppObj.importFromUIModel === "function") ? childAppObj.importFromUIModel(value) : new propConstructor(value).valueOf());
						})
					}
					this[appPropertyName]=arr;
				}
			}
		}
		return this;
	}

	/**
	 * This will load the properties from the given object considering the object as an db object
	 * @param  {Object} obj the db model
	 * @return {Void}     it will load the property values in itself
	 */
	importFromDBModel(obj){
		let properties = this.getProperties();
		let appProperties = properties.properties;
		let dbMap = properties.dbMap;

		let iterableObj = (dbMap || appProperties);
		for(var propName in iterableObj){
			if(!obj.hasOwnProperty(propName) || !iterableObj.hasOwnProperty(propName)  || typeof obj[propName] === "function")
				continue;

			let appPropertyName = dbMap ? dbMap[propName] : propName;
			let dbPropertyValue = obj[propName];

			let propConfig = appProperties[appPropertyName];
			let propConstructor = getConstructor(propConfig);

			if(dbPropertyValue!==null){
				if(!propConfig.isArray){
					let childAppObj = new propConstructor().valueOf();
					if(propConstructor===Date){
						childAppObj = new propConstructor();
					}
					this[appPropertyName] = (typeof childAppObj.importFromDBModel === "function") ? childAppObj.importFromDBModel(dbPropertyValue) : new propConstructor(dbPropertyValue).valueOf();
				}
				else{
					let arr = [];
					if(Array.isArray(dbPropertyValue)){
						dbPropertyValue.forEach(function (value) {
							let childAppObj = new propConstructor().valueOf();
							if(propConstructor===Date){
								childAppObj = new propConstructor();
							}
							arr.push((typeof childAppObj.importFromDBModel === "function") ? childAppObj.importFromDBModel(value) : new propConstructor(value).valueOf());
						})
					}
					this[appPropertyName]=arr;
				}
			}
		}
		return this;
	}

	/**
	 * This will create a UI model using the given object, which is probably the body received from the client request
	 * @param  {Object} obj 
	 * @return {Object}     
	 */
	createUIModel(obj){
		let properties = this.getProperties();
		let appProperties = properties.properties;
		let uiMap = properties.uiMap;
		let newModel = new ValidationModel();

		let iterableObj = (uiMap || appProperties);
		for(var propName in iterableObj){
			if(!obj.hasOwnProperty(propName) || !iterableObj.hasOwnProperty(propName)  || typeof obj[propName] === "function")
				continue;
			
			let appPropertyName = uiMap ? uiMap[propName] : propName;
			let uiPropertyValue = obj[propName];

			let propConfig = appProperties[appPropertyName];
			let propConstructor = getConstructor(propConfig);

			if(uiPropertyValue!==null){
				if(!propConfig.isArray){
					let childAppObj = new propConstructor().valueOf();
					if(propConstructor===Date){
						childAppObj = new propConstructor();
					}
					newModel[propName] = (typeof childAppObj.createUIModel === "function") ? childAppObj.createUIModel(uiPropertyValue) : new propConstructor(uiPropertyValue).valueOf();
				}
				else{
					let arr = [];
					if(Array.isArray(uiPropertyValue)){
						uiPropertyValue.forEach(function (value) {
							let childAppObj = new propConstructor().valueOf();
							if(propConstructor===Date){
								childAppObj = new propConstructor();
							}
							arr.push((typeof childAppObj.createUIModel === "function") ? childAppObj.createUIModel(value) : new propConstructor(value).valueOf());
						})
					}
					newModel[propName]=arr;
				}
			}
		}
		let validations = this.getValidations();
		if(validations){
			if(validations.ui)
				newModel.validations = validations.ui.clone();
			else
				newModel.validations = validations.api.clone();
			newModel.customValidators = this.customValidators;
		}
		return newModel;
	}

	/**
	 * this will export the model in UI model
	 * @return {Object} return a UI model without any validation details etc
	 */
	exportToUIModel(){
		let uiModel = {};
		let properties = this.getProperties();
		let appProperties = properties.properties;
		let uiMap = properties.uiMap;

		let iterableObj = (uiMap || appProperties);
		for(let prop in iterableObj){
			if(!iterableObj.hasOwnProperty(prop)  || typeof iterableObj[prop] === "function")
				continue;
		
			let uiPropName = prop;
			let appPropName = uiMap ? uiMap[prop] : prop;
			let value = this[appPropName];

			if(value && typeof value.exportToUIModel === "function"){
				value = value.exportToUIModel();
			}

			uiModel[uiPropName] = value;
		}
		return uiModel;
	}


	/**
	 * this will export the model in DB model
	 * @return {Object} return a DB model without any validation details etc
	 */
	exportToDBModel(){
		let dbModel = {};
		let properties = this.getProperties();
		let appProperties = properties.properties;
		let dbMap = properties.dbMap;

		let iterableObj = (dbMap || appProperties);
		for(let prop in iterableObj){
			if(!iterableObj.hasOwnProperty(prop)  || typeof iterableObj[prop] === "function")
				continue;
		
			let dbPropName = prop;
			let appPropName = dbMap ? dbMap[prop] : prop;
			let value = this[appPropName];

			if(value && typeof value.exportToDBModel === "function"){
				value = value.exportToDBModel();
			}

			dbModel[dbPropName] = value;
		}
		return dbModel;
	}

}

module.exports = BaseModel;