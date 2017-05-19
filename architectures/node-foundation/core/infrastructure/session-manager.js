"use strict"

let Session = require('express-session');
let config = localrequire('configManager');

class SessionManager {

	/**
	 * to initialize session 
	 * @param  {App} app need the pass the express app object
	 * @return {Void}     
	 */
	init(app) {
		app.use(Session({
			secret: config.server.sessionSecret || "node-foundation-session-secret",
			resave: true,
    		saveUninitialized: true
		}));
	}

	/**
	 * to destroy the session object
	 * @param  {Session} session the session object
	 * @return {Promise}         
	 */
	destroy(session) {
		return new Promise(function (resolve, reject) {
			session.destroy(function(err){
				if(err){
					reject(err);
				}
				else
				{
					resolve(null);
				}
			});
		});
	}

	/**
	 * set a session
	 * @param {[type]} session [description]
	 * @param {[type]} obj     [description]
	 */
	set(session, obj) {
		session.extend(obj);
	}

	get(session,prop) {
		return session[prop];
	}

	delete(session,prop) {
		delete(session[prop]);
	}
}


//exporting the module
module.exports = new SessionManager();