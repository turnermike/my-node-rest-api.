/**
 * startup/validation.js
 *
 * Using Joi for Mongo Schema validation.
 *
 */

require('dotenv-safe').config();
const Joi = require('joi');
const logger = require('../middleware/logger');

module.exports = function() {

  Joi.objectId = require('joi-objectid')(Joi);
  logger.info('Joi validation enabled...');

}