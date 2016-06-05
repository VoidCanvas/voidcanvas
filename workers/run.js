"use strict"

let shell = require('shelljs');
let argv = require('yargs').argv;
let logger = require('../logger');

class Runner {
	work(){
		let runType = process.argv[3] || "";
		runType = runType.toLowerCase();
		let path = shell.pwd();
		let serverFile = null;
		try{
			serverFile = require(`${path}/package.json`).main;
		}
		catch(e){
			logger.error("No project found");
		}

		if(serverFile){
			let isLive = argv.live;
			let isProd = argv.prod;
			let isQa = argv.qa;
			let isDev = argv.dev;

			//shell script to be fired:
			let queryToBeExecuted = "";
			
			if(isLive){
				let networkFlag = "";
				if (argv.network){
					networkFlag = "-L"
				}
				queryToBeExecuted += `${__dirname}/../node_modules/nodemon/bin/nodemon.js ${networkFlag} ${serverFile} `;
			}
			else
				queryToBeExecuted += `node ${serverFile} `;

			if(isProd)
				queryToBeExecuted += "--env=prod";
			else
				if(isQa)
					queryToBeExecuted += "--env=qa";
				else
					queryToBeExecuted += "--env=dev";

			//run the script
			shell.exec(queryToBeExecuted);
		}
	}
}

module.exports = new Runner();

