"use strict"

let shell = require('shelljs');
let BaseScaffolder = require('../base/scaffolder');

class ReactGod extends BaseScaffolder{
	bless(){
		let path = shell.pwd();
		if(this.makePathClear(path)){
			this.scaffold(path);
		}
	}
	get reactFoundationArchitecturePath(){
		return `${__dirname}/../architectures/react-foundation/.`;
	}
	//actual scaffolding
	scaffold(path){
		shell.cp("-R", this.reactFoundationArchitecturePath, path);
	}
}

module.exports = new ReactGod();