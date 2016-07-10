"use strict"

let logger = require("../logger");
let fs = require('fs');
let readlineSync = require('readline-sync');
let shell = require('shelljs');
let StoreCreator = require('./react-store-creator');

let componentNameValidation = new RegExp(/^[a-z0-9]+$/i);
let baseApplicationFolder = shell.pwd();

class ComponentCreator {
	constructor(){
		this.componentName = "";
		this.storeName = "";
	}

	bless(){
		this.collectData();
		return this.buildComponent();
	}

	collectData(){
		//collect component name
		while(!this.componentName){
			let componentName = readlineSync.question("component name : ");
			componentName = componentName.trim().replace(".js","");

			if(componentName){
				if(componentNameValidation.test(componentName)){
					let path = `${baseApplicationFolder}/src/components/${componentName}/${componentName}.js`;
					let isComponentAlreadyExists = false;
					try{
						let stats = fs.statSync(path);
						isComponentAlreadyExists = stats.isFile();
					}
					catch(e){}

					if(isComponentAlreadyExists){
						logger.error("A component with this name already exists. Please try another name.");
					}
					else{
						this.componentName=componentName.trim();
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

		//collect store info
		let requireStore = readlineSync.question("do you want a store for this component? (yes/no) : ");
		if(requireStore.toLowerCase()==="yes")
			requireStore=true;
		else
			requireStore=false;

		if(requireStore){
			let storeInfoObj = (new StoreCreator()).bless();
			this.storeName = storeInfoObj.name.replace(/\//,"");
			this.storePath = storeInfoObj.path;
		}
	}

	buildComponent(){
		if(this.componentName){
			let rawComponent = fs.readFileSync(baseApplicationFolder+"/.voidcanvas/raw-component.js", "UTF-8");
			rawComponent=rawComponent.replace(/@componentName@/g, this.componentName);
			
			if(this.storeName){
				rawComponent=rawComponent.replace(/@storeLink@/g, `
import ${this.storeName} from '../../stores/${this.storeName}'`);
				rawComponent=rawComponent.replace(/@getStoreFunc@/g, `
	getStore(){
		return ${this.storeName};
	}`);
			}
			else{
				rawComponent=rawComponent.replace(/@storeLink@/g, "");
				rawComponent=rawComponent.replace(/@getStoreFunc@/g, "");
			}

			let newComponentFolder = `${baseApplicationFolder}/src/components/${this.componentName}`;
			let newComponentPath = `${baseApplicationFolder}/src/components/${this.componentName}/${this.componentName}.js`;
			fs.mkdirSync(newComponentFolder);
			fs.writeFileSync(newComponentPath, rawComponent);
			logger.success(`component ${this.componentName} is created successfully!`);
			return {
				name: this.componentName,
				path: newComponentPath
			}
		} else {
			logger.error(`component name is not provided!`);
		}
	}
}


module.exports = ComponentCreator;