"use strict"

let shell = require('shelljs');
let BaseScaffolder = require('../base/scaffolder');

class NodeGod extends BaseScaffolder{
	bless(){
		let path = shell.pwd();
		if(this.makePathClear(path)){
			this.scaffold(path);
		}
	}
	get nodeFoundationArchitecturePath(){
		return `${__dirname}/../architectures/node-foundation/.`;
	}
	//actual scaffolding
	scaffold(path){
		shell.cp("-R", this.nodeFoundationArchitecturePath, path);
	}
}

module.exports = new NodeGod();