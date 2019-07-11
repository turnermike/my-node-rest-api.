/**
 * middleware/logger.js
 *
 * Using Winston to log to console, file and database.
 * https://www.npmjs.com/package/winston
 *
 * Available logging levels:
 *
 * error: 0,
 * warn: 1,
 * info: 2,
 * verbose: 3,
 * debug: 4,
 * silly: 5
 *
 * Example of logging:
 *
 * const logger = require('../config/winston');
 *
 * logger.log({
 *   level: 'debug',
 *   message: 'Testing INFO log.',
 *   additional: { test1: 'hello', test2: 'goodbye' },
 *   // more: 'passed along'
 * });
 *
 */
const _ = require('lodash');
const appRoot = require('app-root-path');
const { createLogger, format, transports } = require('winston');
require('winston-mongodb');
const config = require('config');
const dotenv = require('dotenv').config();

// winston options
var options = {

    // default formatting options
    format: format.combine(

        // format.colorize(),
        format.timestamp(),
        format.align(),
        // format.printf(info => `[${info.level}]: ${info.timestamp} ${info.message} ${JSON.stringify(info.additional)}`)
        format.printf(info => `[${info.level}]: ${info.timestamp} ${info.message}`)
        // format.splat(),
        // format.simple(),
        // format.json(),
        // format.prettyPrint(),
    ),

    file: {
        level: 'silly', // silly will accept all other logging levels
        filename: `${appRoot}/logs/errors.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,

    },

    console: {
        level: 'silly',
        handleExceptions: true,
        json: false,
        colorize: true
    },

    mongodb: {
        level: 'silly',
        db: process.env.MONGO_URL
    }

};

// array of available Winston transports based off of config values
let availableTransports = [];
( config.get('logger.errorLogToFile') ) ? availableTransports.push(new transports.File(options.file)) : '';                     // enable log to file from config value
( config.get('logger.errorLogToDB') ) ? availableTransports.push(new transports.MongoDB(options.mongodb)) : '';                 // enable log to database from config value
( config.get('logger.errorLogToConsole') ) ? availableTransports.push(new transports.Console(options.console)) : '';            // enable log to console from config value

// instantiate a new Winston Logger with the settings defined above
const logger = createLogger({
    level: 'info',                      // default level
    format: options.format,             // formatting options
    transports: availableTransports,    // populated array above
    exitOnError: false,                 // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

module.exports = logger;
