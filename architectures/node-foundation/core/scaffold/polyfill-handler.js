var fs = require('fs');
var _app = null; //to be set on init
var polyfillPath = "core/polyfills"

function setupResource(path) {
	if(path.indexOf('.js')===path.length-3){
		var modifiedPath = path.slice(0,path.length-3).replace(/\//g,".");
	    localrequire(modifiedPath);
	}
}

var walkAndInitialize = function (path) {
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


var polyfillHandler = {
	init:function () {
		walkAndInitialize(polyfillPath);
	}
}


module.exports = polyfillHandler;