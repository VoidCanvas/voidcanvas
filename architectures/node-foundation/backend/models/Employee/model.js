/**
 * This is model `Employee`
 */
"use strict"


let BaseModel = localrequire('baseModel');
let validationConfig = require('./validations.json');
let propertiesConfig = require('./properties.json');

class EmployeeModel extends BaseModel{

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
}

module.exports = EmployeeModel;