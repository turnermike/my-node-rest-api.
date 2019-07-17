/**
 * index.js
 *
 * App main/start file.
 *
 */

const express = require('express');
const logger = require('./middleware/logger');

const app = express();

require('./startup/config')(app);                                              // validate env vars and config values
require('./startup/production')(app);                                       // load production environment specific modules
require('./startup/errorHandling')(app);                                    // initialize error handling and message logging
require('./startup/db')();                                                  // initialize db connection
require('./startup/routes')(app);                                           // load routes



// load environmeht variables from .env file to process.env
// const dotenv = require('dotenv');
// // const dotenvResult = dotenv.config();
// // logger.info('.env vars: ' + JSON.stringify(dotenvResult.parsed));





// TUTORIAL STUFF TO REMOVE LATER
// const sharks = require('./routes/sharks');
// const path = __dirname + '/views/';

// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path));

// app.use('/test', test);
// app.use('/sharks', sharks);

// start server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  // console.log(`Example app listening on port ${port}`)
  logger.info(`Express listening on port ${port}`);
});

module.exports = server;