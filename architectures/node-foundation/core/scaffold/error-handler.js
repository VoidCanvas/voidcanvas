"use strict"

class ErrorHandler{
	init(app) {
	    app.use(function (err, req, res, next) {
	        res.status(err.status || 500);  
	        console.log(err.stack);      
	        res.json({
	            message: err.message,
	            error: {}
	        });
	    });

	}
}


module.exports = new ErrorHandler();