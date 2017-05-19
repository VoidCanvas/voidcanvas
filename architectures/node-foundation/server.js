#!/usr/bin/env node

var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var argv = require('yargs').argv;

//initializing local modules
var localrequirehandler = require('./core/scaffold/localrequire');
localrequirehandler.init(); //after this function ran, you will be able to use localrequire

//calling polyfills 
var polyfillhandler = localrequire('core.scaffold.polyfill-handler');
polyfillhandler.init();

//initializing config manager
var config = localrequire('configManager');
config.init(argv.env);

//creating express app
var app = express();

// configure app to use bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //this will let us get the data from a POST

//initializing session handler
var session = localrequire('core.infrastructure.session-manager');
session.init(app);

//initializing resources 
var resourcehandler = localrequire('core.scaffold.resourcehandler');
resourcehandler.init(app);

//initiating error handler
var errorHandler = localrequire('core.scaffold.error-handler');
errorHandler.init(app);


/**
 * Create HTTP server
 */
var server = http.createServer(app);

var port = process.env.PORT || config.server.port; //some application like heroku provides dynamic port

app.set('port', port);


/**
 * listen on provided port
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


/**
 * onError
 * Listen for HTTP 'error' event
 * @param {object} error
 */
function onError(error) {
    if(error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific errors with friendly messages
    switch(error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privilates');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * onListening
 * Listen for http 'listening' event
 * @return {undefined}
 */
function onListening() {
    var addr = server.address();
    var bind = typeof port === 'string'
        ? 'pipe ' + port
        : 'port ' + port;
    console.log('Listening on ' + bind);
}

