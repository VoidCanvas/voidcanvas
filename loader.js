"use strict"

let logger = require('./logger');

let workerMap = {
	"run":{
		"module": "run"
	},
	"debug":{
		"module": "debug"
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
			for(var prop in workerMap){
				if(workerMap.hasOwnProperty(prop)){
					logger.log(prop);
				}
			}
		}
		else{
			let workerModule = require("./workers/"+workerMap[primeWorker].module);
			workerModule.work();
		}

	}
}

module.exports = new Loader();