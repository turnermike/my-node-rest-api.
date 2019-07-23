/**
 * startup/db.js
 *
 * MongoDB connection.
 * Throws fatal error if connection url unavailable.
 *
 */

require('dotenv-safe').config();
const mongoose = require('mongoose');
const config = require('config');
const logger = require('../middleware/logger');

module.exports = function() {

    const devEnvs = ['development'];

    // get mongo connection url
    const url = process.env.MONGO_URL;

    // connect to mongodb
    mongoose.connect(url, { useNewUrlParser: true, useFindAndModify: false })
        .then( () => logger.info(`Connected to MongoDB: ${url}`) )
        .catch(err => {
          logger.error('FATAL ERROR: ', err);
          process.exit(1);
        });
    mongoose.set('useCreateIndex', true);

}