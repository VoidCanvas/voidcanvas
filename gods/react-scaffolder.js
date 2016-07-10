"use strict"

let shell = require('shelljs');
let BaseScaffolder = require('../base/scaffolder');
let reactFoundationProjectVersion = require("../package.json").externalProjects["react-foundation"];
const react_foundation_path = `https://github.com/VoidCanvas/react-foundation/archive/${reactFoundationProjectVersion}.zip`;

class ReactGod extends BaseScaffolder{
	bless(){
		let path = shell.pwd();
		if(this.makePathClear(path)){
			this.scaffold(path);
		}
	}

	//actual scaffolding
	scaffold(path){
		this.downloadAndScaffold(react_foundation_path, path);
	}
}

module.exports = new ReactGod();