/**
 * routes/auth.js
 *
 * Authorization routes calling auth controller.
 * /api/auth
 *
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

/**
 * /api/auth
 *
 * Authenticate/login user.
 *
 */
router.get('/', (req, res) => {

  authController.getAuth(req, res);

});

module.exports = router;
