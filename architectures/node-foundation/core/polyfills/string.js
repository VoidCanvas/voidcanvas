//if matches to any of the strings - case sensitive
String.prototype.matchesAny=function(list){
	var isMatched = false;
	if(list){
		list.forEach(function(element){
			if(element === this.toString())
				isMatched=true;
		}.bind(this))
	}
	return isMatched;
}

//if matches to any of the strings -- case insentitive
String.prototype.matchesAnyCase=function(list){
	var isMatched = false;
	if(list){
		list.forEach(function(element){
			if(element.toString().toLowerCase() === this.toString().toLowerCase())
				isMatched=true;
		}.bind(this))
	}
	return isMatched;
}