"use strict"

let shell = require('shelljs');
let BaseScaffolder = require('../base/scaffolder');
let nodeFoundationProjectVersion = require("../package.json").externalProjects["node-foundation"];
const node_foundation_path = `https://github.com/VoidCanvas/node-foundation/archive/${nodeFoundationProjectVersion}.zip`;

class NodeGod extends BaseScaffolder{
	bless(){
		let path = shell.pwd();
		if(this.makePathClear(path)){
			this.scaffold(path);
		}
	}

	//actual scaffolding
	scaffold(path){
		this.downloadAndScaffold(node_foundation_path, path);
	}
}

module.exports = new NodeGod();