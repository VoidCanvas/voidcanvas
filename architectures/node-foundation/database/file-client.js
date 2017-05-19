"use strict"

let fs = require('fs');
let storePath = './file-store.json';
let storeFullPath = './database/file-store.json';

class FileClient {
	sayHi(){
		return "I am file client";
	}

	save(obj){
		return new Promise(function (resolve, reject) {
			let store = require(storePath);
			store.push(obj);
			fs.writeFile(storeFullPath, JSON.stringify(store), (err) => {
			  if (err)
			  	reject(err);
			  else
			  	resolve(obj);
			});
		});
	}

	findAll(){
		return require(storePath);
	}

	findById(value, key){
		if(!key)
			key = "id";

		let store = require(storePath);
		return store.find(function(obj){
			return obj[key]==value;
		});
	}

	deleteById(value, key){
		return new Promise(function (resolve, reject) {
			let store = require(storePath);
			let selectedObj = this.findById(value, key);

			if(selectedObj){
				store.splice(store.indexOf(selectedObj),1);
				fs.writeFile(storeFullPath, JSON.stringify(store), (err) => {
				if (err)
				  	reject(err);
				  else
				  	resolve(selectedObj);
				});
			}
			else{
				resolve("no such object found!")
			}			
		}.bind(this));
	}
}

module.exports = new FileClient();