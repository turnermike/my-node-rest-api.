/**
 * controllers/users.js
 *
 * User controller processing User routes.
 *
 * Messaging prefix conventions:
 * USER: ... for CRUD operations.
 * No prefix for standard info logs.
 *
 */

// const path = require('path');
// const Shark = require('../models/sharks');
const mongoose = require('mongoose');
const { Users, validatePOST, validatePUT } = require('../models/users');
const { Roles } = require('../models/roles');
const _ = require('lodash');
const ObjectID = require('mongodb').ObjectID;
const bcrypt = require('bcrypt');
const logger = require('../middleware/logger');

/**
 * get current user
 */
exports.getCurrentUser = async (req, res) => {

  // console.log(req.user);

  const user = await Users.findById(req.user._id).select('-password');
  logger.info(`USER: Get current user request: ${req.user._id}`);

  res.send(user);

}

/**
 * get all users
 */
exports.getAllUsers = async (req, res) => {

  try{

    const allUsers = await Users.find();

    if(allUsers.length) {

      logger.info('USERS: Get all users request.');
      res.send(allUsers);

    } else {

      logger.info('USERS: Get all users request, none found.');
      res.status(404).send('No users found.');

    }

  }
  catch(err) {

    logger.error('ERROR: ' + err.message);
    res.send('ERROR: ' + err.message);

  }

}

/**
 * get user by id
 */
exports.getUserById = async (req, res) => {

  try{

    const user = await Users.findById(
        { _id: new ObjectID(req.params.id) },
        (err, user) => {
          
            if (! user) {
                logger.error('USERS: User requested by ID not found.');
                // res.send({ error: err.message });
                res.status(404).send(`The user with the ID ('${req.params.id}') does not exist.`);
                return;
            }

            if(err) {
                logger.error(`Error: ${err.message}`);
                // res.send({ error: err.message });
                res.status(400).send(`Error: ${err.message}`);
                return;

            }

            logger.error(`USERS: Get user by ID: ${req.params.id}.`);
            // logger.error('Get user by ID: \n', user);
            res.send(user);
        }
    );

  }
  catch(err) {

    logger.error('ERROR: ' + err.message);
    res.send('ERROR: ' + err.message);

  }


  // res.send(`Get user: ${req.params.id}`);

}

/**
 * add new user
 */
exports.addNewUser = async (req, res) => {

  // validate
  const { error } = validatePOST(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  // check for existing user
  let user  = await Users.findOne({ email: req.body.email });
  if(user) return res.status(400).send('That email address is associated with an existing user.');


  try{

    // console.log('req.body.userRole', req.body.userRole);

    // get the user role data

    const role = Roles.findOne(ObjectID(req.body._userRole), async (err, role) => {
      // console.log('role', role);

      if(err) {
          logger.error('ERROR: ' + err.message);
          return;
      }

      // validate role id
      if(! role) return res.status(400).send('Invalid role ID');

      // set new user object with post data
      // console.log('req.body from controller', req.body);
      user = new Users({
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        telephone: req.body.telephone,
        organizationName: req.body.organizationName,
        _userRole: {
          _id: role._id,
          label: role.label,
          level: role.level
        }
      });

      // hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);

      // save to db
      await user.save();

      // log message
      logger.info('USERS: New user added: ' + user._id);

      // generate jwt
      const token = user.generateAuthToken();

      res.send(user);
      // res.header('x-auth-token', token).send(_.pick(user, ['email', 'firstName', 'lastName']));

    });

  }
  catch(err) {

    logger.error('ERROR: ' + err.message);
    res.send('ERROR: ' + err.message);

  }

}

/**
 * edit user
 */
exports.editUser = async (req, res) => {

  // validate
  const { error } = validatePUT(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // get the role document
  const role = await Roles.findById(new ObjectID(req.body.userRole));
  // console.log('role', role);

  if (!role) return res.status(400).send('Invalid role ID');

  // find/update
  try {

    // get the user record
    let user = await Users.findById(new ObjectID(req.params.id));
    console.log('user', user);

    // // hash password
    // const salt = await bcrypt.genSalt(10);
    // user.password = await bcrypt.hash(user.password, salt);

    if (user !== null) {

      user = await Users.findByIdAndUpdate(
        { _id: new ObjectID(req.params.id) },
        {
          email: req.body.email,
          password: user.password,                        // not updating the password, using exiting password
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          telephone: req.body.telephone,
          organizationName: req.body.organizationName,
          userRole: {
            _id: role._id,
            label: role.label,
            level: role.level
          }
        },
        { upsert: true, new: true }
      );

      logger.info(`USERS: Updated user: ${req.params.id}`);
      res.send(user);

    } else {

      logger.error('ERROR: User ID not found.');
      res.send('ERROR: User ID not found.');

    }

  } catch (err) {

    logger.error('ERROR: ' + err.message);
    res.send('ERROR: ' + err.message);

  }    



  // res.send(`Edit user: ${req.params.id}`);

}

/**
 * delete user
 */
exports.deleteUser = async (req, res) => {

  try{

    const user = await Users.findByIdAndRemove({ _id: new ObjectID(req.params.id) });
    if (! user) return res.status(404).send('That user ID was not found');

    logger.info(`USERS: Deleted user: ${req.params.id}`);
    res.send(user);

  }
  catch(err) {

    logger.error('ERROR: ' + err.message);
    res.send('ERROR: ' + err.message);

  }

}

