/**
 * index.js
 *
 * App main/start file.
 *
 */

const express = require('express');
const logger = require('./middleware/logger');

const app = express();                      // initialize express object

require('./startup/config')(app);           // validate env vars and config values
require('./startup/production')(app);       // load production environment specific modules
require('./startup/errorHandling')(app);    // initialize error handling and message logging
require('./startup/db')();                  // initialize db connection
require('./startup/routes')(app);           // load routes
require('./startup/validation')();            // load Joi validation module

// start server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => { logger.info(`Express listening on port ${port}...`); });

module.exports = server;