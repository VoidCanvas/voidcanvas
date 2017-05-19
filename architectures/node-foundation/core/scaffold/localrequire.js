"use strict"

let basePath = __dirname+"/../..";
let paths = require('../../configs/localrequire-custom-paths.json');


let localRequireHandler = {
	require:function (modalias) {
	    // read modalias sice its mapping would be done
	    var fullModAlias = modalias;
	    if(paths[fullModAlias])
	    	return this.require(paths[fullModAlias]);
	    else{
	    	var extension = null;
	    	if(modalias.indexOf(".json")===modalias.length-5){
	    		extension=".json";
		    	modalias=modalias.substring(0, modalias.length - 5);
	    	}
	    	else{
	    		if(modalias.indexOf(".js")===modalias.length-3){
		    		extension=".js";
		    		modalias=modalias.substring(0, modalias.length - 3);
		    	}
	    	}
	    	var pathToRequire = basePath+"/" + modalias.replace(/\./g,'/');
	    	if(extension)
	    		pathToRequire+=extension;

	    	return require(pathToRequire);
	    	
	    }
	},

	init:function () {
		/**
		 * expose localrequire on global so that all
		 * files can use it.
		 */
		global.localrequire = this.require.bind(this);


	}
};

module.exports = localRequireHandler;