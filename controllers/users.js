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

  // set new user object with post data
  user = new Users(_.pick(req.body,
    [
      'email', 'password', 'firstName', 'lastName', 'telephone', 'organizationName'
    ]
  ));

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

