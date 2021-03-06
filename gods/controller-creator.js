"use strict"

let logger = require("../logger");
let fs = require('fs');
let readlineSync = require('readline-sync');
let shell = require('shelljs');
let ModelCreator = require('./model-creator');

let controllerNameValidation = new RegExp(/^[a-z0-9]+$/i);
let baseApplicationFolder = shell.pwd();

class ControllerCreator {
	constructor(){
		this.controllerName = "";
		this.modelName = "";
	}

	bless(){
		this.collectData();
		return this.buildController();
	}

	collectData(){
		//collect controller name
		while(!this.controllerName){
			let controllerName = readlineSync.question("controller name : ");
			controllerName = controllerName.trim().replace(".js","");

			if(controllerName){
				if(controllerNameValidation.test(controllerName)){
					let path = baseApplicationFolder + "/backend/controllers/" + controllerName + ".js";
					let isControllerAlreadyExists = false;
					try{
						let stats = fs.statSync(path);
						isControllerAlreadyExists = stats.isFile();
					}
					catch(e){}

					if(isControllerAlreadyExists){
						logger.error("A controller with this name already exists. Please try another name.");
					}
					else{
						this.controllerName=controllerName.trim();
					}
				}
				else{
					logger.error("Only alpha numeric characters allowed.")
				}
			}	
			else{
				logger.error("No name inserted. Try again!");
			}
		}

		//collect model info
		let requireModel = readlineSync.question("do you want a model for this controller? (yes/no) : ");
		if(requireModel.toLowerCase()==="yes")
			requireModel=true;
		else
			requireModel=false;

		if(requireModel){
			let modelInfoObj = (new ModelCreator()).bless();
			this.modelName = modelInfoObj.name.replace(/\//,"");
			this.modelPath = modelInfoObj.relativePath;
		}
	}

	buildController(){
		if(this.controllerName){
			let rawController = fs.readFileSync(baseApplicationFolder+"/.voidcanvas/raw-controller.js", "UTF-8");
			rawController=rawController.replace(/@controllerName@/g, this.controllerName);
			
			if(this.modelName){
				rawController=rawController.replace(/@modelDeclarationArea@/g, `
let ${this.modelName}Model = localrequire('${this.modelPath}.model');`);
				rawController=rawController.replace(/@modelInitializationArea@/g, `
		this.model = new ${this.modelName}Model();
				`);
			}
			else{
				rawController=rawController.replace(/@modelDeclarationArea@/g, "");
				rawController=rawController.replace(/@modelInitializationArea@/g, "");
			}


			let newControllerPath = baseApplicationFolder+"/backend/controllers/"+this.controllerName+".js";
			fs.writeFileSync(newControllerPath, rawController);
			logger.success(`controller ${this.controllerName} is created successfully!`);
			return {
				name: this.controllerName,
				path: newControllerPath
			}
		} else {
			logger.error(`controller name is not provided!`);
		}
	}
}


module.exports = ControllerCreator;