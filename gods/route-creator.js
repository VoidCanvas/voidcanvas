"use strict"

let logger = require("../logger");
let fs = require('fs');
let readlineSync = require('readline-sync');
let shell = require('shelljs');
let ControllerCreator = require('./controller-creator');

let routeNameValidation = new RegExp(/^[a-z0-9]+$/i);
let baseApplicationFolder = shell.pwd();

class RouteCreator {
	constructor(){
		this.routeName = "";
		this.controllerName = "";
	}

	bless(){
		this.collectData();
		return this.buildRoute();
	}

	collectData(){
		//collect router name
		while(!this.routeName){
			let routeName = readlineSync.question("route name : ");
			routeName = routeName.trim().replace(".js","");

			if(routeName){
				if(routeNameValidation.test(routeName)){
					let path = baseApplicationFolder + "/backend/routes/" + routeName + ".js";
					let isRouteAlreadyExists = false;
					try{
						let stats = fs.statSync(path);
						isRouteAlreadyExists = stats.isFile();
					}
					catch(e){}

					if(isRouteAlreadyExists){
						logger.error("A route with this name already exists. Please try another name.");
					}
					else{
						this.routeName=routeName.trim();
					}
				}
				else{
					logger.error("Only alpha numeric characters allowed. If you want the path of the router to be different, you can change the path variable in the router file once it's created.")
				}
			}	
			else{
				logger.error("No name inserted. Try again!");
			}
		}

		//collect controller info
		let requireController = readlineSync.question("do you want a controller for this route? (yes/no) : ");
		if(requireController.toLowerCase()==="yes")
			requireController=true;
		else
			requireController=false;

		if(requireController){
			let controllerInfoObj = (new ControllerCreator()).bless();
			this.controllerName = controllerInfoObj.name;
		}

	}

	buildRoute(){
		if(this.routeName){
			let rawRouter = fs.readFileSync(baseApplicationFolder+"/.voidcanvas/raw-route.js", "UTF-8");
			rawRouter=rawRouter.replace(/@routeName@/g, this.routeName);
			rawRouter=rawRouter.replace(/@routePath@/g, this.routeName);
			if(this.controllerName){
				rawRouter=rawRouter.replace(/@controllerDeclarationArea@/g, `let ${this.controllerName}Controller = localrequire('backend.controllers.${this.controllerName}');`);
				rawRouter=rawRouter.replace(/@controllerInitializationArea@/g, `
		//A must have function
	    createController(){
	        return new ${this.controllerName}Controller();
	    }
				`);
			}
			else{
				rawRouter=rawRouter.replace(/@controllerDeclarationArea@/g, "");
				rawRouter=rawRouter.replace(/@controllerInitializationArea@/g, "");
			}
			console.log(rawRouter);
			let newRoutePath = baseApplicationFolder+"/backend/routes/"+this.routeName+".js";
			fs.writeFileSync(newRoutePath, rawRouter);
			return {
				name: this.routeName,
				path: newRoutePath
			}
		}
	}
}


module.exports = RouteCreator;