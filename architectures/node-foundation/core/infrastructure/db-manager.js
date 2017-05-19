"use strict"

let config = localrequire('configManager');
let dbClient = localrequire(config.database.client);


module.exports = dbClient;