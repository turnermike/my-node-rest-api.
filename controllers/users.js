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
const { Users, validatePOST, validatePUT } = require('../models/users');
const { Roles } = require('../models/roles');
const _ = require('lodash');
const ObjectID = require('mongodb').ObjectID;
const bcrypt = require('bcrypt');
const logger = require('../middleware/logger');

/**
 * get current user
 */
exports.getCurrentUser = function(req, res) {

  res.send('Get current user.');

}

/**
 * get all users
 */
exports.getAllUsers = async function(req, res) {

  try{

    const allUsers = await Users.find();
    console.log('allUsers', allUsers);

    if(allUsers.length) {

      logger.info('USERS: Get all users requested.');
      res.send(allUsers);

    } else {

      logger.info('USERS: Get all users requested, none found.');
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
exports.getUserById = async function(req, res) {

  try{

    const user = await Users.findById(
        { _id: new ObjectID(req.params.id) },
        (err, user) => {
            if (err) {
                logger.error('USERS: User requested by ID not found.');
                // res.send({ error: err.message });
                res.status(404).send(`The user with the ID ('${req.params.id}') does not exist.`);
                return;
            }

            logger.error(`USERS: Get user by ID: ${req.params.id}.`);
            // debug('Get user by ID: \n', user);
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
exports.addNewUser = async function(req, res) {

  // validate
  const { error } = validatePOST(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  // check for existing user
  let user  = await Users.findOne({ email: req.body.email });
  if(user) return res.status(400).send('That email address is associated with an existing user.');


  try{

    // get the user role data
    const role = Roles.findById({ _id: req.body.userRole }, async (err, role) => {

      if(err) {
          logger.error('ERROR: ' + err.message);
          return;
      }

      // validate role id
      if(! role) return res.status(400).send('Invalid role ID');


      // set new user object with post data
      console.log(req.body);
      // user = new Users(_.pick(req.body,
      //   [
      //     'email', 'password', 'firstName', 'lastName', 'telephone', 'organizationName', 'userRole'
      //   ]
      // ));

      user = new Users({
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        telephone: req.body.telephone,
        organizationName: req.body.organizationName,
        userRole: {
          _id: role._id,
          label: role.label,
          level: role.level
        }
      })

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
exports.editUser = async function(req, res) {

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

  } catch (err) {

    logger.error('ERROR: ' + err.message);
    res.send('ERROR: ' + err.message);

  }


  // res.send(`Edit user: ${req.params.id}`);

}

/**
 * delete user
 */
exports.deleteUser = async function(req, res) {

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

