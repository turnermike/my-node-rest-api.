/**
 * middleware/validateObjectId.js
 *
 * Checks req.params.id for a valid MongoDB Objectd.
 *
 */

const mongoose = require('mongoose');
const logger = require('../middleware/logger');

module.exports = function(req, res, next) {

    if (! mongoose.Types.ObjectId.isValid(req.params.id)) {
      logger.info(`Invalid MongoDB Ojbect ID (middleware/validateObjectId.js`);
      return res.status(404).send('Invalid Object ID');
    }



    next();                                                     // pass control to next middleware function

}