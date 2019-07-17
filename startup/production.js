/**
 * startup/production.js
 *
 * Loads production environment specific modules.
 *
 * Helmet - helps secure express by setting HTTP headers
 * Compression - a file compression middleware
 *
 */

const helmet = require('helmet');
const compression = require('compression');
const logger = require('../middleware/logger');

module.exports = function(app) {

    app.use(helmet());
    logger.info('Helmet enabled...');

    app.use(compression());
    logger.info('Compression enabled...')

}
