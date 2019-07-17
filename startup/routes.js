/**
 * startup/routes.js
 *
 * Load routes and middleware.
 *
 */

const express = require('express');
const home = require('../routes/home');
const users = require('../routes/users');

module.exports = function(app) {

  app.use(express.json());                            // use express.json middleware in request processing pipeline
  app.use(express.urlencoded({ extended: true }));    // allow use of key/value pairs with post data

  app.use('/', home);                                 // load home/root routes

  app.use('/api/users', users);


}
