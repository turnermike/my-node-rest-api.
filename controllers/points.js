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
const usersController = require('../controllers/users');
const { Points, validatePOST } = require('../models/points');
const _ = require('lodash');
const ObjectID = require('mongodb').ObjectID;
const logger = require('../middleware/logger');


/**
 * add points
 */
exports.insertPointsTransaction = async (req, res) => {


  logger.info('insertPointsTransaction() req.params.id: ' + req.params.id)
  logger.info('insertPointsTransaction() req.body from controller: ' + JSON.stringify(req.body));
  // return false;


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

/**
 * transfer points from current user to another user id
 */
exports.transferPoints = async (req, res) => {

  logger.info('transferPoints()', req.user);
  // logger.info('req.params: ' + JSON.stringify(req.params));
  logger.info('req.body: ' + JSON.stringify(req.body));

  let recipient_id = req.body.recipient_id;                                           // get recipient user id from request body
  let sender_id = req.user._id;                                                       // get current (sender) user id from req.user object
  logger.info('Transfer to: ' + recipient_id);
  logger.info('Transfer from: ' + sender_id);


  // // check for existing user
  // const user = await Users.findById({ _id: new ObjectID(recipient_id) }).select('-password');
  // if (! user) return res.status(404).send(`That user ID (${recipient_id}) was not found.`);

  let sender_points_available = await this.getUsersPoints(sender_id);                 // get sender's points balance
  console.log('sender_points_available (from return)', sender_points_available);

  if( sender_points_available >= req.body.points ) {                                  // if sender has enough points available

    req.body.action = 'add';
    this.insertPointsTransaction(req, res);

  }



  





  // res.sendStatus(200);









}


/**
 * get user's points balance
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
        // "_user._id": '5d7a8ba2f218fcb03e1c1a53'                               // match this sub document user id
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
  // ], function (err, points) {
  //   if (err) {
  //     logger.error('ERROR: ' + err);
  //     return;
  //   }
  //   console.log('points (from callback)', points);
  // });

  // ]).exec()

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





