"use strict"

let logger = require('./logger');

let workerMap = {
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
			Object.keys(workerMap).forEach(prop=>{
				logger.log(prop);
			});
		}
		else{
			let workerModule = require("./workers/"+workerMap[primeWorker].module);
			workerModule.work();
		}

	}
}

module.exports = new Loader();