/**
 * routes/points.js
 *
 * Points routes calling Users controller.
 * /api/points
 *
 */

const express = require('express');
const router = express.Router();
const pointsController = require('../controllers/points');
const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');

// add points
router.post('/:id', [auth, validateObjectId], (req, res) => {

  pointsController.insertPointsTransaction(req, res);

});

// remove points
router.delete('/:id', [auth, validateObjectId], (req, res) => {

  pointsController.insertPointsTransaction(req, res);

});

// transfer points
router.put('/:id', [auth, validateObjectId], (req, res) => {

  pointsController.transferPoints(req, res);

});

module.exports = router;
