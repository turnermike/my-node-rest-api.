/**
 * routes/index.js
 *
 * Root or public routes
 * /
 *
 */

const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index');

router.get('/', (req, res) => {
    indexController.getHomePage(req, res);
});

module.exports = router;