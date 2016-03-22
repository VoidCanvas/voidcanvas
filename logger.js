"use strict"

let chalk = require('chalk');

class Logger {
	log(whatever){
		console.log(chalk.white(whatever));
	}

	error(whatever){
		console.log(chalk.red(whatever));
	}

	success(whatever){
		console.log(chalk.green(whatever));
	}

	different(whatever){
		console.log(chalk.blue(whatever));
	}

}


module.exports = new Logger();