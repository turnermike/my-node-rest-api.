/**
 * controllers/points.js
 *
 * Points controller processing Points routes.
 *
 * Messaging prefix conventions:
 * POINTS: ... for CRUD operations.
 * ERROR: ... for errors.
 * No prefix for standard info logs.
 *
 */

// const mongoose = require('mongoose');
const { Users } = require('../models/users');
const usersController = require('../controllers/users');
const { Points, validatePOST } = require('../models/points');
const _ = require('lodash');
const ObjectID = require('mongodb').ObjectID;
const logger = require('../middleware/logger');


/**
 * add/remove points
 */
exports.insertPointsTransaction = async (req, res) => {

  // logger.info('insertPointsTransaction() req.params.id: ' + req.params.id)
  // logger.info('insertPointsTransaction() req.body from controller: ' + JSON.stringify(req.body));
  
  const current_user = await Users.findById({ _id: new ObjectID(req.params.id) }).select('-password');    // get current user/sender object
  if (! current_user) return res.status(404).send(`That user ID (${req.params.id}) was not found.`);
  logger.info(JSON.stringify(current_user));

  const { error } = validatePOST(req.body);                                                               // validate post data via Joi
  if(error) return res.status(400).send(error.details[0].message);                                        // return with error/status code
  
  if( req.body.action.toLowerCase() === 'transfer') {                                                     // transfer points

    let recipient_id = req.body.recipient_id;                                                             // get recipient user id from request body
    let sender_id = current_user._id;                                                                     // get sender id from passport request parameters
    logger.info('Transfer to: ' + recipient_id);
    logger.info('Transfer from: ' + sender_id);

    try {

      const remove_sender_points = new Points({                                                           // remove senders points
        _user: {
          _id: current_user._id,
          _email: current_user.email
        },
        points: req.body.points,
        action: 'remove'
      });

      await remove_sender_points.save();                                                              

      const recipient_user = await Users.findById({ _id: new ObjectID(sender_id) }).select('-password');  // get recipient user object
      if (! recipient_user) return res.status(404).send(`That user ID (${sender_id}) was not found.`);

      const add_recipient_points = new Points({                                                           // add recipients points
        _user: {
          _id: recipient_user._id,
          _email: recipient_user.email
        },
        points: req.body.points,
        action: 'add'
      });

      await add_recipient_points.save();    

      logger.info(`POINTS: New transfer from ${recipient_id} to ${sender_id}`);           // log message

      res.send(req.body);                                                                                 // return response

    }
    catch(err) {

      logger.error('ERROR: ' + err.message);
      res.send('ERROR: ' + err.message);      

    }

  } else {                                                                                                // add or remove points

    try{

      // set new points object with post data
      const points = new Points({
        _user: {
          _id: user._id,
          _email: user.email
        },
        points: req.body.points,
        action: req.body.action.toLowerCase()
      });

      await points.save();

      logger.info(`POINTS: New transaction record for user ${user._id}`);                               // log message

      res.send(points);                                                                                 // return response

    }
    catch(err) {

      logger.error('ERROR: ' + err.message);
      res.send('ERROR: ' + err.message);

    }

  }





}

/**
 * Transfer Points from Current User to Another User ID
 *
 */
exports.transferPoints = async (req, res) => {

  logger.info('transferPoints()', req.user);

  let recipient_id = req.body.recipient_id;                                                             // get recipient user id from request body
  let sender_id = req.user._id;                                                                         // get current (sender) user id from req.user object

  // // check for existing user
  // const user = await Users.findById({ _id: new ObjectID(recipient_id) }).select('-password');
  // if (! user) return res.status(404).send(`That user ID (${recipient_id}) was not found.`);

  let sender_points_available = await this.getUsersPoints(sender_id);                                   // get sender's points balance
  console.log('sender_points_available (from return)', sender_points_available);

  if( sender_points_available >= req.body.points ) {                                                    // if sender has enough points available

    this.insertPointsTransaction(req, res);                                                             // call insertPointsTransaction()

  } else {

    logger.error('ERROR: ' + err.message);
    res.send(404).message(`The sending user (${sender_id}) does not have enough points available. Try a lower amount.`);

  }

}


/**
 * Get User's Points Balance
 *
 * @param ObjectId The user id to lookup.
 *
 * @return Object The points added, points removed, points balance.
 *
 */
exports.getUsersPoints = async (user_id) => {

  logger.info('getUsersPoints()' + JSON.stringify(user_id));

  let points = await Points.aggregate([
    {
      $match: 
      {
        "_user._id": user_id                                                  // match this sub document user id
      },
    },
    {
      $group:
      {
        _id: null,
        "to_add": { 
          "$sum": {
            "$cond": [
              { "$eq": ["$action", "add"] },                                  // sum values from 'points' column were action column is 'add'
              "$points",
              0
            ]
          }
        },
        "to_subtract": {
          "$sum": {
            "$cond": [
            { "$eq": ["$action", "remove"] },                                 // sum values from 'points' column were action column is 'remove'
            "$points",
            0
            ]
          }
        }
      }
    },
    {
      $project:
      {
          "points_available": { "$subtract": ["$to_add", "$to_subtract"] },   // subtract the 'remove' points from 'add' points
          "points_added": "$to_add",                                          // amount to add
          "points_removed": "$to_subtract"                                    // amount to subtract
      }    
    }
  ]).then(results => {                                                        // process results

    // console.log('results (from then()): ', results);
    return results;

  }, function(err) {                                                          // error handler

    if (err) {

      logger.error('ERROR: ' + err);
      return;

    }

  });

  return points;                                                              // return results from aggregator pipeline

}





