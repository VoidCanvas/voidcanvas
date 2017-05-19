/**
 * This is model `Ping`
 */
"use strict"


let BaseModel = localrequire('baseModel');
let validationConfig = require('./validations.json');
let propertiesConfig = require('./properties.json');

let customValidators = {
	estdValidator: function (obj, estd) {
		if(estd > new Date().getFullYear()){
			return {
				code: 12345,
				msg: "Future companies are not allowed"
			}
		}
	}
}

class OfficeModel extends BaseModel{

	//the constructor of the model. 
	constructor(obj){
		super(obj);

		//model specific customizations can be done here
	}

	getProperties(){
		return propertiesConfig;
	}

	getValidations(){
		return validationConfig;	
	} 

	//validators
	get customValidators() {
		return customValidators;
	}
}

module.exports = OfficeModel;