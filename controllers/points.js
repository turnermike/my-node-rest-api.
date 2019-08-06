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

  logger.info(req.body);

  // validate
  const { error } = validatePOST(req.body);
  if(error) return res.status(400).send(error.details[0].message);



  // // check for existing user
  // let user  = await Points.findOne({ email: req.body.email });
  // if(user) return res.status(400).send('That email address is associated with an existing user.');

  res.send(user);

  try{
    // console.log('tes');
    // console.log('req.body.userId', req.body.userId);

    // get the user role data

    // const role = Roles.findOne(ObjectID(req.body._userRole), async (err, role) => {
    //   // console.log('role', role);

    //   if(err) {
    //       logger.error('ERROR: ' + err.message);
    //       return;
    //   }

    //   // validate role id
    //   if(! role) return res.status(400).send('Invalid role ID');

    //   // set new user object with post data
    //   // console.log('req.body from controller', req.body);
    //   user = new Points({
    //     email: req.body.email,
    //     password: req.body.password,
    //     firstName: req.body.firstName,
    //     lastName: req.body.lastName,
    //     telephone: req.body.telephone,
    //     organizationName: req.body.organizationName,
    //     _userRole: {
    //       _id: role._id,
    //       label: role.label,
    //       level: role.level
    //     }
    //   });

    //   // hash password
    //   const salt = await bcrypt.genSalt(10);
    //   user.password = await bcrypt.hash(user.password, salt);

    //   // save to db
    //   await user.save();

    //   // log message
    //   logger.info('USERS: New user added: ' + user._id);

    //   // generate jwt
    //   const token = user.generateAuthToken();

    //   res.send(user);
    //   // res.header('x-auth-token', token).send(_.pick(user, ['email', 'firstName', 'lastName']));

    // });

  }
  catch(err) {

    logger.error('ERROR: ' + err.message);
    res.send('ERROR: ' + err.message);

  }

}





