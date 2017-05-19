"use strict"

let fs = require('fs');
let _app = null; //to be set on init
let express = require('express');
let compression = require('compression');
let config = localrequire('configManager');

let resourcePath = "backend/routes";
let actualResourcePath = "./../../backend/routes";

function setupResource(path) {
	if(path.indexOf('.js')===path.length-3){
		var modifiedPath = path.slice(0,path.length-3);
		modifiedPath=modifiedPath.replace(resourcePath,actualResourcePath);
		require(modifiedPath).init(_app);
	}
}

let walkAndInitializeResouce = function (path) {
	var files = fs.readdirSync(path);
	if (files && files.length){
		files.forEach(function(file) {
		    var actualPath = path+"/"+file;
		    var stats = fs.statSync(actualPath);
		    if(stats.isDirectory())
		    		walkAndInitializeResouce(actualPath);
		    	else
		    		if(stats.isFile())
		    			setupResource(actualPath);
		});
	}
}



function shouldCompress(req, res) {
	if (req.headers['x-no-compression']) {
	// don't compress responses with this request header
	return false
	}

	// fallback to standard filter function
	return compression.filter(req, res)
}


let resourceHandler = {
	init:function (app) {
		_app = app;

		//setting up headers
		app.use(function(req, res, next) {
			if(config.server && config.server.headers){
				var obj = config.server.headers;
				for (var i in obj) {
					if (obj.hasOwnProperty(i)) {
						res.header(i, obj[i]);
				  	}
				}
			}
			next();
		});

		//compression
		if(config.server && config.server.response && config.server.response.isCompress)
			app.use(compression())


		//walking and initializing other routes
		walkAndInitializeResouce(resourcePath);

		//initialize public folder
		app.use(express.static(config.client.baseFolder));		
	}
}

module.exports = resourceHandler;