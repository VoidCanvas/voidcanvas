"use strict"

let BaseRoute = localrequire('baseRoute');@controllerDeclarationArea@

/**
 * Providing path is mandatory. 
 * @type {String}
 */
const path = "/@routePath@";

/**
 //for custom route configuration uncomment the following 
const routeConfig = {

}
*/

class @routeName@ extends BaseRoute{
    constructor(path){
        super(path);
        //do your stuffs here
    }@controllerInitializationArea@

/*
    //Uncomment this function too if using custom route configuration
    getRouteConfig(){
        return routeConfig;
    }
*/
    //A must have function
    getPath(){
        return path;
    }

    //[GET] : /
    findAll(req, res){
        res.end("Route @routeName@ is working");
    }

/*
    //[POST] : /
    create(req, res){
    }

    //[GET] : /:id
    findById(req, res){
    }

    //[PUT] : /:id
    update(req, res){
    }

    //[DELETE] : /:id
    deleteById(req, res){   
    }
*/

}

module.exports = new @routeName@();
