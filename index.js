/**
 * index.js
 *
 * App main/start file.
 *
 */

require('dotenv-safe').config();
const express = require('express');
const logger = require('./middleware/logger');

const app = express();                      // initialize express object

require('./startup/config')(app);           // validate env vars and config values
if (process.env.NODE_ENV === 'produciton') require('./startup/production')(app);       // load production environment specific modules
require('./startup/errorHandling')(app);    // initialize error handling and message logging
require('./startup/db')();                  // initialize db connection
require('./startup/routes')(app);           // load routes
require('./startup/validation')();            // load Joi validation module

const devEnvs = ['development'];            // possible development NODE_ENV names

// start server
const port = process.env.PORT || 3000;
// const server = app.listen(port, () => { (devEnvs.includes(process.env.NODE_ENV)) ? logger.info(`Express listening on port ${port}...`) : ''; });
const server = app.listen(port, () => { logger.info(`Express listening on port ${port}...`); });

module.exports = server;