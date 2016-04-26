"use strict"

let shell = require('shelljs');
let argv = require('yargs').argv;
let logger = require('../logger');

class Debugger {
	work(){
		let runType = process.argv[3] || "";
		runType = runType.toLowerCase();
		let path = shell.pwd();
		let serverFile = require(`${path}/package.json`).main;

		let isProd = argv.prod;
		let isQa = argv.qa;
		let isDev = argv.dev;

		//shell script to be fired:
		let queryToBeExecuted = `${__dirname}/../node_modules/node-inspector/bin/node-debug.js ${serverFile} `;

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

module.exports = new Debugger();

