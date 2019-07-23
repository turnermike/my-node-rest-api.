/**
 * startup/routes.js
 *
 * Load routes and middleware.
 *
 */

const express = require('express');
const expressErrors = require('../middleware/expressErrors');
const index = require('../routes/index');
const users = require('../routes/users');
const auth = require('../routes/auth');

module.exports = function(app) {

  app.use(express.json());                            // use express.json middleware in request processing pipeline
  app.use(express.urlencoded({ extended: true }));    // allow use of key/value pairs with post data

  app.use('/', index);                                 // load index/root routes
  app.use('/api/users', users);                       // /api/users/
  app.use('/api/auth', auth);                         // /api/auth/

  app.use(expressErrors);                             // use error handling middleware

}
