/**
 * index.js
 *
 * App main/start file.
 *
 */

const express = require('express');
const logger = require('./middleware/logger');

// const db = require('./db');

const app = express();
// const router = express.Router();

require('./startup/errorHandling')(app);                                    // initialize error handling and message logging
require('./startup/db')();                                                  // initialize db connection
require('./startup/routes')(app);                                           // load routes




// MOVE THIS TO A MIDDLEWARE
// load environmeht variables from .env file to process.env
const dotenv = require('dotenv');
// const dotenvResult = dotenv.config();
// logger.info('.env vars: ' + JSON.stringify(dotenvResult.parsed));





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
app.listen(port, () => {
  // console.log(`Example app listening on port ${port}`)
  logger.info(`Express listening on port ${port}`);
});
