"use strict"

let logger = require('../logger');

let appMap = {
	"node":{
		module: "node-scaffolder"
	},
	"react": {
		module: "react-scaffolder"
	}
}

class Founder {
	work(){
		let appType = process.argv[3];
		if(!appType || !appMap[appType]){
			logger.error("You haven't specify the last argument which denotes which type of app you wanna scaffold");
			logger.error("You can use any of the following: ");
			Object.keys(appMap).forEach(prop=>{
				logger.log(prop);
			});
		}
		else{
			let god = require("../gods/"+appMap[appType].module);
			god.bless();
		}
	}
}

module.exports = new Founder();