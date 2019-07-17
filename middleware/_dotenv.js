/**
 * middleware/dotenv.js
 *
 *
 */

const dotenv = require('dotenv');
const logger = require('./logger');

module.exports = () => {

  const dotenvResult = dotenv.config();
  // logger.info('.env vars: ' + JSON.stringify(dotenvResult.parsed));

}