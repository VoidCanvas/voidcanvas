
> Use node.js v4.1.2 or greater.

> Void Canvas cli is still in experiment phrase. We will not recommend you to use it for your production apps till the time it doesn't hit version 1.0.0


## What is Void Canvas cli
A simple package to help you scaffold a node/express application very easily with a predefined architechture, which has 3 different layers of configuration (dev, qa, prod). This architecture has a simple but effective way of creating routers, controllers, services, handling database and many more.

* This is NOT a framework like sails, loopback etc; rather it provides you a boilerplate node-express app where creating routes, controllers, models and dealing with them are very easy.
* No need to write translators for 3 layer (ui contract, application, database) models. Translators are inbuilt and generic for all models.
* Easy validation setup for models. 
* Controllers are linked to routes and models are linked to controllers. So in routes `this.controller` and in controllers `this.model` will do the job for you.
* `localrequire()` is a function very similar to require, but do not require a relative path.


## Tutorial
### Install
	$ npm install -g voidcanvas

### Scaffold an app
	$ mkdir myApp
	$ cd myApp
	$ vc found node
	//answer the questions 
	
> Before running the app please change the database source path in `configs/server/dev.json`

### Run the app
	$ vc run //this will run the project (dev config)
	$ vc run --live //run the project and auto restart if any modification done
	$ vc run --qa //with qa config
	$ vc run --prod --live //run live with prod config

> The codebase contains a basic example with a route, controller and model named as `Employee`. You can check how they are created and being used. Check the validations also.

### configurations
In the folder `configs`, you will find another directory `server`, where there are configuration for three different environments. In `configs` folder there's another file `localrequire-custom-paths` where you can set any shortcut path for any frequently used module of yours.


### Try some api
A basic example of router, controller and model is given there. You can check the folder `backend` folder and to see it working, run the app and check route `/api/employee`

### Creating new route
	$ vc create route
	//answer the questions

### Creating new controller
	$ vc create controller
	//answer the questions

### Creating new model
	$ vc create model
	//answer the questions
After running this, you need to set and map the model properties manually. See the employee model.

> May be the documentation is not covering or making everything clear as active development is going on now. You can raise a issue in github if you have any confusion. 
