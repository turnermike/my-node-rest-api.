/**
 * startup/routes.js
 *
 * Load routes and middleware.
 *
 */

const express = require('express');
const expressErrors = require('../middleware/expressErrors');
const passport = require('passport');
const index = require('../routes/index');
const auth = require('../routes/auth');
const users = require('../routes/users');
const points = require('../routes/points');

module.exports = function(app) {

  app.use(express.json());                            // use express.json middleware in request processing pipeline
  app.use(express.urlencoded({ extended: true }));    // allow use of key/value pairs with post data

  app.use(passport.initialize());                     // initialize passport
  app.use(passport.session());                        // initialize passport sessions state (use req.user accross app)

  app.use('/', index);                                // load index/root routes
  app.use('/api/auth', auth);                         // /api/auth/
  app.use('/api/users', users);                       // /api/users/
  app.use('/api/points', points);                     // /api/points

  app.use(expressErrors);                             // use error handling middleware

}
