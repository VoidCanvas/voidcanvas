"use strict"

let logger = require("../logger");
let fs = require('fs');
let readlineSync = require('readline-sync');
let shell = require('shelljs');


let modelNameValidation = new RegExp(/^[a-z0-9/]+$/i);
let baseApplicationFolder = shell.pwd();

class ModelCreator {
	constructor(){
		this.modelName = "";
		this.modelName = "";
	}

	bless(){
		this.collectData();
		return this.buildModel();
	}

	collectData(){
		//collect model name
		while(!this.modelName){
			let modelName = readlineSync.question("model name : ");
			modelName = modelName.trim().replace(".js","").replace(/\./g,"/");

			if(modelName){
				if(modelNameValidation.test(modelName)){
					let path = baseApplicationFolder + "/backend/models/" + modelName + "/model.js";
					let isModelAlreadyExists = false;
					try{
						let stats = fs.statSync(path);
						isModelAlreadyExists = stats.isFile();
					}
					catch(e){}

					if(isModelAlreadyExists){
						logger.error("A model with this name already exists. Please try another name.");
					}
					else{
						this.modelName=modelName.trim();
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

	}

	buildModel(){
		if(this.modelName){
			let relativePath = ("backend/models/"+this.modelName).replace(/\//g,".");
			let newModelPath = baseApplicationFolder+"/backend/models/"+this.modelName;
			fs.mkdirSync(newModelPath);

			//creating the model file
			let rawModel = fs.readFileSync(baseApplicationFolder+"/.voidcanvas/raw-model/model.js", "UTF-8");
			let modelNameInModelFile = this.modelName.split("/")[this.modelName.split("/").length-1];
			rawModel=rawModel.replace(/@modelName@/g, modelNameInModelFile);
			fs.writeFileSync(newModelPath+"/model.js", rawModel);

			//creating properties.json
			let rawProperties = fs.readFileSync(baseApplicationFolder+"/.voidcanvas/raw-model/properties.json", "UTF-8");
			fs.writeFileSync(newModelPath+"/properties.json", rawProperties);

			//creating validations.json
			let rawValidations = fs.readFileSync(baseApplicationFolder+"/.voidcanvas/raw-model/validations.json", "UTF-8");
			fs.writeFileSync(newModelPath+"/validations.json", rawValidations);

			logger.success(`model ${this.modelName} is created successfully!`);
			return {
				name: this.modelName,
				path: newModelPath,
				relativePath: relativePath
			}
		} else {
			logger.error(`model name is not provided!`);
		}
	}
}


module.exports = ModelCreator;