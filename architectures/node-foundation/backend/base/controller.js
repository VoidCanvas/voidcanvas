"use strict"

let sessionManager = localrequire('core.infrastructure.session-manager');
let dbClient = localrequire('dbClient');

class BaseController {
	constructor(){
		this.sessionManager = sessionManager;
		this.dbClient = dbClient;
	}
}


module.exports = BaseController;