"use strict"

let dbPath = localrequire("configManager").database.source;
let mongoNative = require("mongodb").MongoClient;
let ObjectID = require('mongodb').ObjectID;
let collectionName = "employee";

class MongoClient {
	sayHi(){
		return "I am mongo client";
	}

	save(obj){
		obj._id = new ObjectID();
		return new Promise(function (resolve, reject) {
			mongoNative.connect(dbPath, function (err, db) {
			  	if (err) {
			    	console.log('Unable to connect to the mongoDB server. Error:', err);
			    	reject(err);
			  	} else {
			    	var collection = db.collection(collectionName);
			    	collection.insert([obj], function (err, result) {
					    db.close();
				      	if (err) {
				        	console.log(err);
				        	reject(err)
				      	} else {
				      		console.log(result.ops[0]);
			    	    	resolve(result.ops[0]);
			      		}
				    });
			  	}
			});
		});
	}

	findAll(){
		return new Promise(function (resolve, reject) {
			mongoNative.connect(dbPath, function (err, db) {
			  	if (err) {
			    	console.log('Unable to connect to the mongoDB server. Error:', err);
			    	reject(err);
			  	} else {
			    	var collection = db.collection(collectionName);
			    	collection.find().toArray(function (err, result) {
					    db.close();
				      	if (err) {
				        	console.log(err);
				        	reject(err)
				      	} else {
				      		result.map((obj)=>{
				      			obj._id = obj._id.toString();
				      			return obj;
				      		})
			    	    	resolve(result);
			      		}
				    });
			  	}
			});
		});
	}

	findById(value, key){
		if(!key)
			key = "_id";
		return new Promise(function (resolve, reject) {
			let findingObj = {};
			if(key === "_id")
				findingObj[key] = ObjectID(value);
			else
				findingObj[key]=value;

			mongoNative.connect(dbPath, function (err, db) {
			  	if (err) {
			    	console.log('Unable to connect to the mongoDB server. Error:', err);
			    	reject(err);
			  	} else {
			    	var collection = db.collection(collectionName);
			    	collection.find(findingObj).toArray(function (err, result) {
					    db.close();
				      	if (err) {
				        	console.log(err);
				        	reject(err)
				      	} else {
				      		let requiredObj = result[0];
				      		if(requiredObj){
				      			requiredObj._id = requiredObj._id.toString();
			    	    		resolve(requiredObj);
				      		}
				      		else{
				      			reject();
				      		}
			      		}
				    });
			  	}
			});
		});
	}

	deleteById(value, key){
		if(!key)
			key = "_id";

		return new Promise(function (resolve, reject) {
			let findingObj = {};
			if(key === "_id")
				findingObj[key] = ObjectID(value);
			else
				findingObj[key]=value;

			mongoNative.connect(dbPath, function (err, db) {
			  	if (err) {
			    	console.log('Unable to connect to the mongoDB server. Error:', err);
			    	reject(err);
			  	} else {
			    	var collection = db.collection(collectionName);
			    	collection.remove(findingObj, function (err, result) {
					    db.close();
				      	if (err) {
				        	console.log(err);
				        	reject(err)
				      	} else {
			    	    	resolve(result);
			      		}
				    });
			  	}
			});
		});
	}
}

module.exports = new MongoClient();