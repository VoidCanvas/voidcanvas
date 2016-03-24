"use strict"

let logger = require('../logger');
let packageJSON = require('../package.json');
let shell = require('shelljs');
let fs = require('fs');

let baseApplicationFolder = shell.pwd();

let componentMap = {
	"route":{
		"module": "route-creator"
	},
	"controller":{
		"module": "controller-creator"
	},
	"model":{
		"module": "model-creator"
	}
}


class Creator {
	work(){
		try{
			let vcRawInfo = require(baseApplicationFolder+"/.voidcanvas/info.json");
			let vcRawCliVersion = +vcRawInfo.cli.minVersion.replace(/\./g,"");
			let currentCliVersion = +packageJSON.version.replace(/\./g,"");
			logger.log("vcRawCliVersion "+vcRawCliVersion);
			logger.log("currentCliVersion"+currentCliVersion);

			if(vcRawCliVersion > currentCliVersion){
				logger.error("The voidcanvas cli version is unable to process the request!");
				logger.error("Kindly run the following conad to upgrade: ");
				logger.different("npm update -g voidcanvas");
				return false;
			}
		}
		catch(e){
			logger.error("Seems you are not in the root folder of a void canvas node project.");
			logger.error("Please navigate to the base folder or run the following command to scaffold the project:");
			logger.different("vc found node");
			return false;
		}

		let componentType = process.argv[3];
		if(!componentType || !componentMap[componentType]){
			logger.error("You haven't specify the last argument which denotes which type of app you wanna scaffold");
			logger.error("You can use any of the following: ");
			logger.log("1. route ");
			logger.log("2. controller ");
			logger.log("3. model ");
		}
		else{
			let god = new (require("../gods/"+componentMap[componentType].module))();
			god.bless();
		}
	}
}

module.exports = new Creator();