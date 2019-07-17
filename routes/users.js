/**
 * routes/users.js
 *
 *
 */

const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

router.get('/me', (req, res) => {
    // res.send('get current user');
    usersController.getCurrentUser(req, res);
});

module.exports = router;