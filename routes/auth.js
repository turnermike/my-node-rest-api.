/**
 * routes/auth.js
 *
 * Authorization routes calling auth controller.
 *
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

// login/authenticate user
router.get('/', (req, res) => {

  authController.getAuth(req, res);

});

module.exports = router;
