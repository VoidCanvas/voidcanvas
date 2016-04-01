"use strict"

let shell = require('shelljs');


let logger = require('../logger');


class Runner {
	work(){
		let runType = process.argv[3];

		if(runType && runType.toLowerCase()==="live"){
			let path = shell.pwd();
			let serverFile = require(`${path}/package.json`).main;
			shell.exec(`${__dirname}/../node_modules/nodemon/bin/nodemon.js ${serverFile}`);
		}
		else{
			shell.exec("npm start");
		}
	}
}

module.exports = new Runner();

