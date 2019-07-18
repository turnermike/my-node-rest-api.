/**
 * controllers/users.js
 *
 * User controller processing User routes.
 *
 */

// const path = require('path');
// const Shark = require('../models/sharks');
const { Users, validate } = require('../models/users');

// get current user
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
exports.addNewUser = function(req, res) {

  res.send('Add new user.');

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

