/**
 * middleware/auth.js
 *
 *
 */
const jwt = require('jsonwebtoken');
const logger = require('./logger');

function auth(req, res, next) {

    const token = req.header('x-auth-token');
    // console.log('token', token);

    if (! token) return res.status(401).send("Not authorized, no token provided.");

    try{

      const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
      // console.log('process.env.JWT_PRIVATE_KEY', process.env.JWT_PRIVATE_KEY);
      // console.log('decodedL', decoded);

      req.user = decoded;
      next(); // pass control to next middleware function

    }
    catch(err) {

      logger.error('ERROR: Invalid JWT.');
      res.status(400).send('Invalid token');

    }

}

module.exports = auth;