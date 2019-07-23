/**
 * middleware/expressErrors.js
 *
 * Will only catch errors associated with Express request processing pipeline.
 * Will ignore errors outside the context of Express.
 *
 */

const logger = require('./logger');

module.exports = function(err, req, res, next){

    logger.error('ERROR: ' + err.message);

    res.status(500).send(TypeError(err.message));

    next();

}
