/**
 * startup/config.js
 *
 * Initialize dotenv-safe to populate server environment variables from .env file values.
 *
 * dotenv-safe will throw an exception if the variables in .env.example are not
 * populated in .env.
 *
 */

const dotenvsafe = require('dotenv-safe');
const config = require('config');
const logger = require('../middleware/logger');

module.exports = function(app) {

  logger.info('Validating env vars and config values...');

  // const envVars = dotenvsafe.config();                     // output all env vars
  // console.log('\n\n---------------------------------------------------------')
  // console.log(envVars.parsed);
  // console.log('---------------------------------------------------------\n\n')


  console.log('\n\n---------------------------------------------------------')
  console.log(config.get('logger'));
  console.log('---------------------------------------------------------\n\n')


  loggerVals = config.get('logger');                          // validate logger values


  for (let [key, value] of Object.entries(loggerVals)) {      // loop each value
    console.log(`${key}: ${value}`);
  }



}

