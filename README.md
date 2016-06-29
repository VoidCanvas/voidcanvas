
### for documentation with screenshots please check [here](http://voidcanvas.com/cli).

> npm install -g voidcanvas

> Use node.js v4.1.2 or greater.

Assuming that you are familiar with node.js and have already installed `void canvas cli` in your computer globally, using the command given above; I'm starting the hows' and whys' of this Command Line Interface. 

## What is this cli for
In simple words, it just gives you a predefined architecture for your node application and you can create your components like router, controller model etc very easily and linked to each other. Below is the feature list.

* This is NOT a framework, this is a cli which help to create boilerplate code and components inside it.
* 3 layers of models (ui contract, application level, database contract) without the headache of writing translator functions. You can override it for any specific model.
* Dynamic model property (which can be xyz type of a model) can also be implemented easily (concept of generics).
* Easy validation setup in ui contract models.
* Rather than using `require()` with relative path, you can use `localrequire()` where you can provide an absolute path from the root directory, or can also write a short name for any components of yours.
* Configuration setup for 3 different environments (dev, qa, prod) and running them with ease.
* No headache of creating component files manually and copy pasting the similar code. The command line takes care of those.
* Easy router setup with path configuration. Controller from a central point, so no need to go and edit every single route in case of a path modification.
* Route, Controller and Model are linked (if added them using commands). You can use `this.controller` in route to access it's controller and `this.model` from controller for the same.
* Many predefined pollyfills. 
* The cli is on ES6. As node is modern now and ES6 is awesome. There is no reason to hold on to ES5 (as we are not dealing with browsers).

## How to start with?
Well, as you've already installed `voidcanvas cli`, now the first task is to scaffold the boilerplate node project. So create a folder and scaffold. 

	mkdir myProj
	cd myProj
	vc found node
	//answer the questions

If you have any git project link, it will pickup the names and urls from there. Try the following

	git clone myProj@github.com/myProj.git
	cd myProj
	vc found node
	//answer the questions.


So your boilerplate code is ready now. The boilerplate contains an example route Employee. You can setup the mongodb urls in `./configs/server/dev.json` and run the command below to start accessing `Employee` route. (you can create an account in mongolab website and get the database url)

	vc run --dev
	//will start listening to 1729 port

You can check the route as follows


### Create an employee [POST]
> http://localhost:1729/api/employee/

You can use the url above to create an Employee object. Use postman (or any other such tool) to create http requests. And to know what to post you can check the file `./backend/models/Employee/properties.json`. We will discuss about the structure and workflow of models later on. Check the screenshot below to know what to post.

You can try posting `estd` with a future year or removing `name` in `worksFor` property to get validation errors.


### FindAll [GET]
> http://localhost:1729/api/employee

Though the url is same as create, but it's a `GET` request. Hit this in postman, or even in your browser and you will get the list of employees you created bit while ago.


### FindById [GET]
> http://localhost:1729/api/employee/:id

From `findAll`, note down an id and use it here in this request to get the details of that particular employee. 


### DeleteById [DELETE]
> http://localhost:1729/api/employee/:id

It's a `delete` call to delete the employee which has the id above.
Try `findAll` after deleting that employee and you won't be able to find him.

### UpdateById [PUT]
> http://localhost:1729/api/employee/:id

It's a put call with the same contract as `create` employee to update that particular employee.


## Describing the architecture
If you look at the scaffolded application, you will find many folders and files whose details have been given below. (except README.md, package.json and .gitignore, considering you are already familiar with them).


### .voidcanvas/
This is a folder, which is not a part of your project, but helps to create components of that project. You don't have to care much about that; but you need to keep that folder to create your components successfully.

### backend/
Contents inside this folder is the actual rest project components. Inside this folder, there's a folder named `base`, which contains the base router, controller and model from whom the actual route, controller and models of your project will be inherited. Again, you don't have to care about the files of that `base` folder (you can modify them if you want anything common in all your components).
After `base`, there's a folder `controllers` which contains all your controllers. Any new controller created by the cli will be saved there only.
The folder `routes` and `models` also works similar as `controllers`, but you will find the elements inside `models` are different in structure. There are some `.json` files over there. Well, we will discuss about the models later on.

### configs/server/
Inside configs/server there are three json files which holds the configurations of the application in different environment. If you check any of them, suppose `dev.json`, there inside the property `server` there are different configs related to server. Like, port number, what should be initial route of apis (if you remember Employee route was accessible inside `/api`. That /api was coming from here only), which folder should be served as static and few others (property `client` denotes that). You can put any property in this json file and it will be accessible from `configManager`. We will talk about `configManager` later on.

### configs/localrequire-custom-paths.json
Well, before talking about this file, lemme tell you about `localrequire`. Just like you `require()` in your modules, you also can use `localrequire()` which always considers the path from the root directory. Eg: if from any file in the project you want to require the controller `Employee`, you have to use `localrequire("backend.controllers.Employee")` irrespective of your relative position. Ofcourse you can use `require()` also if you like it, but `localrequire` has few advantages. In you are writing code in some file and you want the relative position, you need to `find that out`, but reminding the absolute path is easy. Secondly, there are some modules or components which are used very heavily. For an example we often use the module `configManager` in our project which is inside the path `core/scaffold/config-manager.js`. Everytime while using, writing an entire path is painful. But we `localrequire("configManager")` in any of our files and we get the module, because the relative path is mapped inside the `localrequire-custom-paths.json` file. So `localrequire()` helps you forgetting the pain of finding out relative path and it can also make the paths shorter for you. 

### core/
core is the folder where the major infra related files can be found. It contains multiple folders and files which has been described properly below. 

### core/infrastructure/
In this folder there's a `db-manager` which works as db client. You can check the use of `dbClient` in Employee controller. According to the setting in your config file db-manager picks up the actual db client. So in your entire project you can `localrequire("dbClient")` anywhere and can get the db client module which has been set there in config. For any kind of change in your database drivers, you never have to make changes in your actual code.

### core/pollyfills/
As the name suggests, the files inside this folder are used to create polyfills. You don't need any separate entry anywhere. Just dump the file here, write the pollyfill and the function will be available from anywhere inside the project.

### core/scaffold/
The files inside this deals with running of the application. They create routers, handle pollyfills, build the localrequire and also the configManager. 

### database/
They are the actual guys who talks to the database. In the config file if you set the path of any of them and `localrequire(dbClient)` anywhere in project, you will get that module only. Just like `mongo-client`, there is another one `file-client`. You can create your `sql-client` or anything else and change the config file in `configs/server/` folder.

### frontend/
This is the folder from where static files will be served. Again, the configuration was given in the config file only. You can try reaching `http://localhost:1729/` from your browser and you will get the index file inside `frontend` folder as output.

## Understanding models
As in this boilerplate, models are little complicated to understand and very easy to use, we are picking that up for discussion before route and controller.

Models here are created with the combination of a `.js` and two `.json` files. While using the model you need to `require` the the js file. 

### properties in models

To explain with, let us check an example. Go to the folder `backend/models/Employee`. There you will find three files. A `model.js`, which is the actual model of yours and from application code you need to require that only. There is a `properties.json` file where the properties of that model is defined with it's `type`. This `type` can be a primitive type like `String`, `Number`, `Date`, `Boolean` or even a model which you created before. If you see, the `type` of the property `worksFor` is `Office`, which is another model. If that Office model was in `backend/models/myNestedModels/Office` folder, we need to use `myNestedModels.Office` as the value of `type` of the property `worksFor`. In case you are not sure what should be the type of a particular property in your model, you can set it to `Object`. 

`isArray: true` makes the property an array of the given `type` (check `previousEmployers` property). And a `value` will provide a default value while initializing the model (Check property `name`). 

Now, the properties you just declared are the ones which will be available in your app level model. But we are supporting three levels of modeling. One is the main app level model, another is the UI contract model which will be used to receive request and send response via http call and another is the DB contract which will be used to interact with the DB.

Suppose I want to keep the first name of a model `Student` as `firstName` in my app as it's good to deal with a long property name. But while sending to UI, I may want to send it as `fName` as it will save bandwidth. Suppose I'm saving only `dob` in database but the app and the ui model also (or only) include `age`. For any date I may use a string `yyyy-MM-dd` in UI contract, a propert `Date` object in application level, and may be epoch time while saving to db. These kind of scenarios are common and that's why many people prefer three level architecture. So, this boilerplate also provides easy way to deal with this scenario.

In the `properties.json` file you can find two more things; `uiMap` and `dbMap`. The keys inside them are the keys of ui contract model and database contract model respectively. By this mapping you can easily rename the properties in different levels of model. And if you want the name of the properties to be same in all the three levels, you can simply remove the `uiMap` and `dbMap` property; or any one of them. However how to change the type of the value and using the concept of generics will be discussed after a few paragraphs.

### inbuilt functions 

There are five inbuilt functions available in the models. They are as follows.
`createUIModel(anyRandomObject)`, which creates a ui model from any given object. Generally that given object is the object provided by the rest api consumer. `exportToUIModel()` is a function which returns you a UI model from the existing state of the model. `exportToDBModel()` does the same to convert it to db model. `importFromUIModel()` and `importFromDBModel()` does the exact opposite. You can check their use in Employee controller which is present in `backend/controllers/Employee`.

So, you can modify or override these functions in your `model.js` if you want to do some stuffs like changing values, adding some properties in any particular model. Or you can create a polyfill if that property type is a primitive. Check `date.js` in polyfills. 

In UI and app models, there is a `validate()` function available which helps to validate the models. We will discuss about the validation in the next paragraph.

### validations
For validation, it internally uses [imvalid](https://www.npmjs.com/package/imvalid). Just like `properties.json`, there's a `validations.json`available in the folder of Employee. If you have a look at that, you will easily understand the things you need to do to provide validations. There are two inbuilt validation rules available; `required` and `number`. But you can provide custom validation too.

To provide custom validations, you need to specify a property named `customValidators`, which will be an object with functions inside it; and these functions can be used as custom validation function inside the `validations.json`. An example has been given below.

**validations.json**

	{
		"ui":{
			"name":{
				"rules":["customNameValidator"],
				"controlName":"name"
			}
		}
	}


**model.js**

	let customValidators = {
		customNameValidator: function (obj, property) {
			if (property.length<10){
				return {
					code: 11111,
					msg: "Too small name"
				}
			}
		}
	}
	
	class EmployeeModel extends BaseModel{
		constructor(obj){
			super(obj);
		}
		getProperties(){
			return propertiesConfig;
		}
		getValidations(){
			return validationConfig;	
		}
		get customValidators(){
			return customValidators;
		}
	}
	
	module.exports = EmployeeModel;

The first argument in the validation function is the object itself and the second one is the property value; i.e. in the example property is the value of the property name. So you write your rule and just return an object with `msg` property, describing the error. If you don't return anything or return null, it will be considered as validation success.

After setting up the validation rules, you can validate any object created from that model class by `myModelObject.validate()`function. Which will return a boolean value to indicate if the object is valid or not; and you can also get that flag in `myModelObject.isValid` property once the `.validate()` has ran. The model object will have another property `validationErrors` which is an array and will contain the error message objects. Note that, if the model is like that `Employee` model in our project, which has an `Office` model inside it, and you run the `myEmployee.validate()` in employee model object and there was a validation error in `worksFor` property object of it, which is actually an object of type `Office`, than the `validationErrors` array containing the errors will be found in `myEmployee.worksFor.validationErrors` array and not in `myEmployee.validationErrors`.

### create a model
Creating a model is easy here. You just have to be in your root directory and the following command.

	vc create model
	model name: TestModel //answering questions
	
This will put the model in your `backend/models/` folder. However if you want to put your model inside any other directory which is present inside `backend/models/`, you can go and create that as following, considering you have created a folder names `dummy`.

	vc create model
	model name: dummy.TestModel

### Using models as generics 
Well, using dynamic models or generics is a tweak here. Below is an example.

Suppose A class student is there whose properties.json file is as follows:

	{
		"properties":{
			"name": {
				"type": "String",
				"value": "UnNamed"
			},
			"goesTo": {
				"type": "Object"
			}
		}
	}
Why the type of `goesTo` is Object, because we don't know if he goes to an school or a university. So depending on situation we may set it as School or University model. Below is how the `model.js` of Student looks like:

	class Student extends BaseModel{
		//the constructor of the model. 
		constructor(obj, organizationType){
			super(obj, organizationType);
		}
	
		beforeSetup(obj, organizationType){
			this.organizationType = organizationType;
		}
	
		getProperties(){
			let propConfig = propertiesConfig.clone();
			if(this.organizationType)
				propConfig.properties.goesTo.type = this.organizationType;
			return propConfig;
		}
	
		getValidations(){
			return validationConfig;	
		} 
	}
	
	module.exports = Student;

And suppose we also have models of `University` and `School` ready. Now we want to use the model Student as a student of university model, suppose from our university controller. So we need to use it like below:

	var model = Student({}, "University");

This will return an object of `Student` class in which the type of `goesTo` is `University`.

Hope this helps you to understand the model architecture. If you have any confusion raise an issue in github and I will address.

## Controllers

Controllers are just normal as any other controller, nothing special. You can create the controller with the following command from your root directory of the project.

	vc create controller
	//answer questions
	//remember it will also ask if you
	//want a model to associate with it.
	//if you say yes, it will create a new model and 
	//that will be accessible as this.model from the controller

### properties

You can find `this.request` in your controller object. Inside this request object, you will get `body` which is the request body sent by the http request. So basically `this.request.body` gives you the body of the request inside the controller. You can have `this.request.session` which will provide the session object which is an `express-session` by default. And you can also get `this.request.params` which contains the query params and also the `:id` provided in the url. So you can get that `:id` by `this.request.params.id` and query params like `this.request.params.myQueryParam`.

## Routes

	vc create route
	//answer questions
	//remember it will also ask if you
	//want a controller to associate with it.
	//if you say yes, it will create a new controller and 
	//that will be accessible as this.controller from the router

Routes are pushed to `backend/routes` folder. The base path of the routes are given inside the config file, which is there in `configs/server/` folder for different environments. Each route has it's own individual route path (which must be unique) given in the file and by default includes five routes who are:

* [GET] routePath/
* [GET] routePath/:id
* [POST] routePath/
* [PUT] routePath/:id
* [DELETE] routePath/:id

and these routes are mapped to five functions named `findAll()`, `findById()`, `create()`, `update()` and `deleteById()`. Example can be found in the predefined route `Employee`.

Apart from that if you want to define your own path, it's also easy. All it needs is a property `routeConfig`. The syntax is as follows:

	let BaseRoute = localrequire('baseRoute');
	let MilestoneController = localrequire('backend.controllers.Milestone');

	const path = "/Milestone";
	
	const routeConfig = {
	    "/markAsVerified/:id/":{
	        "method": "put",
	        "function": "markAsVerified"
	    }
	}
	
	class Milestone extends BaseRoute{
	    constructor(path){
	        super(path);
	    }
		//A must have function
		createController(){
		    return new MilestoneController();
		}
	    //A must have function
	    getRouteConfig(){
	        return routeConfig;
	    }
	    //A must have function
	    getPath(){
	        return path;
	    }
	    markAsVerified(req, res){
	        this.controller.markAsVerified().then(response=>{
	            res.json(response);
	        });
	    }
	}
	
	module.exports = new Milestone();

## Others
Below are few useful commands:

	vc run --dev //to run with dev config
	vc run --qa //to run with qa config
	vc run --prod //to do the same with 
	vc debug //opens the node-inspector debugger
	vc run --dev --live //live running. No need to restart the server after editing any file.

Again, if you find any difficulty understanding or implementing the routes you can raise an issue in github.

