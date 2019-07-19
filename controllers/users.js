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
const { Users, validate } = require('../models/users');
const { Roles } = require('../models/roles');
const _ = require('lodash');
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
exports.getAllUsers = function(req, res) {

  res.send('Get all users.');

}

/**
 * get user by id
 */
exports.getUserById = function(req, res) {

  res.send(`Get user: ${req.params.id}`);

}

/**
 * add new user
 */
exports.addNewUser = async function(req, res) {

  // validate
  const { error } = validate(req.body);
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
      logger.info('USER: New user added: ' + user._id);

      // generate jwt
      const token = user.generateAuthToken();

      res.send(user);
      // res.header('x-auth-token', token).send(_.pick(user, ['email', 'firstName', 'lastName']));

    });

  }
  catch(err) {

    logger.error('ERROR: ' + err.message);
    res.send(err.message);

  }

}

/**
 * edit user
 */
exports.editUser = function(req, res) {

  res.send(`Edit user: ${req.params.id}`);

}

/**
 * delete user
 */
exports.deleteUser = function(req, res) {

  res.send(`Delete user: ${req.params.id}`);

}

