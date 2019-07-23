/**
 * startup/production.js
 *
 * Loads production environment specific modules.
 *
 * Helmet - helps secure express by setting HTTP headers
 * Compression - a file compression middleware
 *
 */
require('dotenv-safe').config();
const helmet = require('helmet');
const compression = require('compression');
const logger = require('../middleware/logger');

// const prodEnvs = ['production'];              // array of NODE_ENV values to use this module

module.exports = function(app) {

  // if(prodEnvs.includes(process.env.NODE_ENV)) {

    app.use(helmet());
    logger.info('Helmet enabled...');

    app.use(compression());
    logger.info('Compression enabled...')

  // }

}
