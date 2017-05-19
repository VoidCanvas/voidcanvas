"use strict"

Date.prototype.exportToDBModel = function() {
	return this.valueOf();
}

Date.prototype.exportToUIModel = function(){
	return this.toString();
}

Date.prototype.importFromDBModel = function(val){
	this.setUTCMilliseconds(-this.valueOf());
	this.setUTCMilliseconds(val);
	return this;
}

Date.prototype.importFromUIModel = function(val){
	this.setUTCMilliseconds(-this.valueOf());
	this.setUTCMilliseconds(new Date(val).valueOf());
	return this;
}
