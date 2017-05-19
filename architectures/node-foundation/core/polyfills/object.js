Object.prototype.extend=function(obj){

	for (var i in obj) {
		if (obj.hasOwnProperty(i)) {
			if(obj[i]  && typeof obj[i] === "object"){
					this[i] = obj[i].clone();
			}
			else
		   		this[i] = obj[i];
	  	}
	}
	return this;
}

Object.prototype.clone = function () {
	var emptyObject = new this.constructor();
	return emptyObject.extend(this);
}

Object.prototype.exportToDBModel = function () {
	return this;
}

Object.prototype.exportToUIModel = function () {
	return this;
}

Object.prototype.createUIModel = function (obj) {
	return obj;
}

Object.prototype.importFromUIModel = function (uiModel) {
	return uiModel;
}

Object.prototype.importFromDBModel = function (dbModel) {
	return dbModel;
}