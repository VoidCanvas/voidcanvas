"use strict"

let logger = require('../logger');

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