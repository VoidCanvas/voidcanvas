"use strict"

let BaseController = localrequire('baseController');
let EmployeeModel = localrequire('backend.models.Employee.model');
let collectionName = "employee";

class EmployeeController extends BaseController {
	constructor(){
		super();
		this.model = new EmployeeModel();

		//do your stuffs here
	}

	create(obj){
		let uiModel = this.model.createUIModel(obj); //creating a propert ui contract object
		uiModel.validate(); //validating the model

		return new Promise((resolve, reject) => {
			if(uiModel.isValid){
				this.model.importFromUIModel(uiModel); //if ui model is valid, update the app model

				let dbObject = this.model.exportToDBModel(); // will return the db object for that particular model

				this.dbClient.save(dbObject).then(function (obj) {
					resolve({"id": obj._id}); //if saved successfully, return the saved object id
				}, function () {
					resolve("error occured while saving!!"); //in case of error
				});				
			}
			else{
				if(uiModel.validationErrors.length)
					resolve(uiModel.validationErrors);
				else{
					if(uiModel.companyDetails.validationErrors.length)
						resolve(uiModel.companyDetails.validationErrors);
					else
						resolve("validation failed!!");
				}
			}
		});
	}

	findAll(){
		return new Promise((resolve, reject) => {
			this.dbClient.findAll().then((data) => {
				let employees = data.createDBModel(EmployeeModel);
				resolve(employees.exportToUIModel());
			}, ()=>{
				resolve("no records");
			});
		});
	}

	findById(){
		let id = this.request.params.id;
		return new Promise((resolve, reject) => {
			this.dbClient.findById(id, "_id").then((data) => {
				let employee = this.model.importFromDBModel(data);
				resolve(employee.exportToUIModel());
			}, () => {
				resolve("not found");
			});
		});
	}

	deleteById(){
		let id = this.request.params.id;
		return new Promise((resolve, reject) => {
			this.dbClient.deleteById(id, "_id").then(()=>{
				resolve("deleted");
			}, ()=> {
				resolve("some error occured")
			})
		});
	}
}

module.exports = EmployeeController;