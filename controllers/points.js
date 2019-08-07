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

const mongoose = require('mongoose');
const { Users } = require('../models/users');
const { Points, validatePOST } = require('../models/points');
// const { Roles } = require('../models/roles');
const _ = require('lodash');
const ObjectID = require('mongodb').ObjectID;
const bcrypt = require('bcrypt');
const logger = require('../middleware/logger');


/**
 * add points
 */
exports.addPoints = async (req, res) => {

  // check for existing user
  const user = await Users.findById({ _id: new ObjectID(req.params.id) }).select('-password');
  if (! user) return res.status(404).send(`That user ID (${req.params.id}) was not found.`);

  logger.info(JSON.stringify(user));

  // validate
  const { error } = validatePOST(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  // res.send(user);

  try{

    console.log('user._id', user._id);


    // set new points object with post data
    const points = new Points({
      userId: user._id,
      points: req.body.points,
      action: req.body.action.toLowerCase()
    });

    // save the points record
    await points.save();

    res.send(points);


    //   // log message
    //   logger.info('USERS: New user added: ' + user._id);

    //   res.send(user);
    //   // res.header('x-auth-token', token).send(_.pick(user, ['email', 'firstName', 'lastName']));


  }
  catch(err) {

    logger.error('ERROR: ' + err.message);
    res.send('ERROR: ' + err.message);

  }

}





