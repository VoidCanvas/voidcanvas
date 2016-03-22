"use strict"

let logger = require("../logger");
let fs = require('fs');
let readlineSync = require('readline-sync');
let shell = require('shelljs');


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
	}

	buildController(){
		if(this.controllerName){
			let rawController = fs.readFileSync(baseApplicationFolder+"/.voidcanvas/raw-controller.js", "UTF-8");
			rawController=rawController.replace(/@controllerName@/g, this.controllerName);
			rawController=rawController.replace(/@modelDeclarationArea@/g, "");
			rawController=rawController.replace(/@modelInitializationArea@/g, "");
			let newControllerPath = baseApplicationFolder+"/backend/controllers/"+this.controllerName+".js";
			fs.writeFileSync(newControllerPath, rawController);
			return {
				name: this.controllerName,
				path: newControllerPath
			}
		}
	}
}


module.exports = ControllerCreator;