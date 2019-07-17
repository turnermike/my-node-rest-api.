/**
 * controllers/users.js
 *
 *
 */

// const path = require('path');
// const Shark = require('../models/sharks');
const { Users, validate } = require('../models/users');

// get current user
exports.getCurrentUser = function(req, res) {

    res.send('Get current user.');

}

