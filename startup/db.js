/**
 * startup/db.js
 *
 * MongoDB connection.
 *
 */

const mongoose = require('mongoose');
const config = require('config');
const logger = require('../middleware/logger');
const dotenv = require('dotenv').config();

module.exports = function() {

    // const connStr = (process.env.NODE_ENV === 'production') ? process.env.mongodb : config.get('mongodb');
    const url = process.env.MONGO_URL;

    // connect to mongodb
    mongoose.connect(url, { useNewUrlParser: true, useFindAndModify: false })
        .then( () => logger.info(`Connected to MongoDB: ${url}`))
        .catch(err => logger.error('Error: ', err));
    mongoose.set('useCreateIndex', true);

}