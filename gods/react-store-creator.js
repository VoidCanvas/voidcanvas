"use strict"

let logger = require("../logger");
let fs = require('fs');
let readlineSync = require('readline-sync');
let shell = require('shelljs');


let storeNameValidation = new RegExp(/^[a-z0-9/]+$/i);
let baseApplicationFolder = shell.pwd();

class StoreCreator {
	constructor(){
		this.storeName = "";
	}

	bless(){
		this.collectData();
		return this.buildStore();
	}

	collectData(){
		//collect store name
		while(!this.storeName){
			let storeName = readlineSync.question("store name : ");
			storeName = storeName.trim().replace(".js","").replace(/\./g,"/");

			if(storeName){
				if(storeNameValidation.test(storeName)){
					let path = `${baseApplicationFolder}/src/stores/${storeName}.js`;
					let isStoreAlreadyExists = false;
					try{
						let stats = fs.statSync(path);
						isStoreAlreadyExists = stats.isFile();
					}
					catch(e){}

					if(isStoreAlreadyExists){
						logger.error("A store with this name already exists. Please try another name.");
					}
					else{
						this.storeName=storeName.trim();
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

	buildStore(){
		if(this.storeName){
			let newStorePath = baseApplicationFolder+"/src/stores/"+this.storeName;

			//creating the store file
			let rawStore = fs.readFileSync(baseApplicationFolder+"/.voidcanvas/raw-store.js", "UTF-8");
			rawStore=rawStore.replace(/@storeName@/g, this.storeName);
			fs.writeFileSync(newStorePath+".js", rawStore);

			logger.success(`store ${this.storeName} is created successfully!`);
			return {
				name: this.storeName,
				path: newStorePath
			}
		} else {
			logger.error(`store name is not provided!`);
		}
	}
}


module.exports = StoreCreator;