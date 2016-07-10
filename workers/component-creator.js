"use strict"

let logger = require('../logger');
let packageJSON = require('../package.json');
let shell = require('shelljs');
let fs = require('fs');
let compareVersions = require('compare-versions');

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
	},
	"store":{
		"module": "react-store-creator"
	},
	"component":{
		"module": "react-component-creator"
	}
}


class Creator {
	work(){
		try{
			let vcRawInfo = require(baseApplicationFolder+"/.voidcanvas/info.json");
			if(compareVersions(vcRawInfo.cli.minVersion, packageJSON.version)===1){
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
			logger.error("You haven't provided a valid third argument which denotes what type of component you want to create.");
			logger.error("You can use any of the following: ");
			Object.keys(componentMap).forEach(prop=>{
				logger.log(prop);
			});
		}
		else{
			let god = new (require("../gods/"+componentMap[componentType].module))();
			god.bless();
		}
	}
}

module.exports = new Creator();