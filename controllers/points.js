/**
 * controllers/points.js
 *
 * Points controller processing Points routes.
 *
 * Messaging prefix conventions:
 * POINTS: ... for CRUD operations.
 * No prefix for standard info logs.
 *
 */

// const mongoose = require('mongoose');
const { Users } = require('../models/users');
const { Points, validatePOST } = require('../models/points');
const _ = require('lodash');
const ObjectID = require('mongodb').ObjectID;
const logger = require('../middleware/logger');


/**
 * add points
 */
exports.insertPointsTransaction = async (req, res) => {


  // logger.info('req.params.id: ' + req.params.id)
  // logger.info('req.body from controller: ' + JSON.stringify(req.body));

  // check for existing user
  const user = await Users.findById({ _id: new ObjectID(req.params.id) }).select('-password');
  if (! user) return res.status(404).send(`That user ID (${req.params.id}) was not found.`);
  // logger.info(JSON.stringify(user));

  // check for points value


  // validate
  const { error } = validatePOST(req.body);
  // logger.info('error: ' + error.details[0].message);
  if(error) return res.status(400).send(error.details[0].message);
  

  try{

    // set new points object with post data
    const points = new Points({
      // userId: user._id,
      _user: {
        _id: user._id,
        _email: user.email
      },
      points: req.body.points,
      action: req.body.action.toLowerCase()
    });

    // save the points record
    await points.save();

    // log message
    logger.info(`POINTS: New transaction record for user ${user._id}`);

    // return response with points object
    res.send(points);

  }
  catch(err) {

    logger.error('ERROR: ' + err.message);
    res.send('ERROR: ' + err.message);

  }

}


