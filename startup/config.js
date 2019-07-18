/**
 * startup/config.js
 *
 * Verify that config/ values have been set properly. Throws an error.
 * Verify that .env variables have been populated. Throws a fatal error.
 *
 * Initialize dotenv-safe to populate server environment variables from .env file values.
 *
 */

const dotenvsafe = require('dotenv-safe');
const config = require('config');
const logger = require('../middleware/logger');

module.exports = function(app) {

  logger.info('Validating env vars and config values...');

  // console.log('\n\n---------------------------------------------------------');
  // console.log(config.get('logger'));
  // console.log('---------------------------------------------------------\n\n');

  /**
   * validate config values
   */
  loggerVals = config.get('logger');                          // validate logger values

  for (let [key, value] of Object.entries(loggerVals)) {      // loop each value

    if(typeof(value) !== 'boolean') {                         // if value is boolean
      logger.error('FATAL ERROR: A logger config value is not boolean.');
      process.exit(1);                                        // kill the app
    }

  }


  /**
   * validate .env vars
   */
  const envVars = dotenvsafe.config({ allowEmptyValues: true });                     // output all env vars

  // console.log('\n\n---------------------------------------------------------')
  // console.log(envVars.parsed);
  // console.log('---------------------------------------------------------\n\n')

  for (let [key, value] of Object.entries(envVars.parsed)) {
    // console.log(`${key}: ${value} - ${typeof(value)}`);

    if(value === '' || typeof(value) === 'undefined') {
      logger.error(`ERROR: The ${key} environment variable is not set in .env.`);
    }

  }


}

