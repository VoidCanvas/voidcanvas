"use strict"

let logger = require('../logger');

let workerMap = {
	"run":{
		"module": "run"
	},
	"found": {
		"module": "founder"
	},
	"create": {
		"module": "component-creator"
	}
}


class Loader{
	load(){
		//thie is the prime working argument
		let primeWorker = process.argv[2];

		if(!primeWorker || !workerMap[primeWorker]){
			logger.error("Wrong first argument");
			logger.error("You can use any of the following: ");
			logger.log("1. found");
			logger.log("2. create");
		}
		else{
			let workerModule = require("./"+workerMap[primeWorker].module);
			workerModule.work();
		}

	}
}

module.exports = new Loader();