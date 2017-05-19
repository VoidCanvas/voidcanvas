"use strict"

let BaseController = localrequire('baseController');@modelDeclarationArea@

class @controllerName@ extends BaseController {
	constructor(){
		super();@modelInitializationArea@
		//do your stuffs here
	}
}

module.exports = @controllerName@;