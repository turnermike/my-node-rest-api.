/**
 * startup/errorHandling.js
 *
 * Log unhandled rejections.
 * Log unhandled promise rejections.
 *
 * Morgan - HTTP request logger middleware.
 * https://www.npmjs.com/package/morgan
 *
 * Winston - Log to console, file and database.
 * https://www.npmjs.com/package/winston
 *
 */

require('express-async-errors');
const logger = require('../middleware/logger');
const morgan = require('morgan');
const config = require('config');

module.exports = function(app) {

    const devEnvs = ['development', 'test'];

    // output debug info
    if(devEnvs.includes(app.get('env'))) {
        logger.info(`MONGO_URL: ${process.env.MONGO_URL}`);
        // logger.info(`jwtPrivateKey: ${config.get('jwtPrivateKey')}`);
        logger.info(`NODE_ENV: ${process.env.NODE_ENV}`);
    }

    // log any express uncaught exceptions
    process.on('uncaughtException', (ex) => {
        logger.log({
            level: 'error',
            message: ex.message
        });
        // process.exit(1);
    })

    // log any unhandled promise rejections
    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

    // create a stream object with a 'write' function that will be used by `morgan`
    logger.stream = {
      write: function(message, encoding) {
        logger.info(message);               // use the 'info' log level so the output will be picked up by both transports (file and console)
      },
    };

    // use morgan http request logger for development only
    if (app.get('env') === 'development'){
        app.use(require("morgan")("common", { "stream": logger.stream }));
        logger.info('Morgan enabled...');
    }

}