"use strict"

let logger = require('../logger');

let componentMap = {
	"route":{
		"module": "route-creator"
	},
	"controller":{
		"module": "controller-creator"
	}
}


class Creator {
	work(){
		let componentType = process.argv[3];
		if(!componentType || !componentMap[componentType]){
			logger.error("You haven't specify the last argument which denotes which type of app you wanna scaffold");
			logger.error("You can use any of the following: ");
			logger.log("1. node ");
		}
		else{
			let god = new (require("../gods/"+componentMap[componentType].module))();
			god.bless();
		}
	}
}

module.exports = new Creator();