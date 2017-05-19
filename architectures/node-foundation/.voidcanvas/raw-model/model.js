"use strict"

let BaseModel = localrequire('baseModel');
let validationConfig = require('./validations.json');
let propertiesConfig = require('./properties.json');

/*
//Put your custom validators here if you have any
let customValidators = {

}
*/

class @modelName@ extends BaseModel{
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

	/*
	//Uncoment this in case of custom validation of any property
	get customValidators(){
		return customValidators;
	}
	*/
}

module.exports = @modelName@;