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

  pointsController.addPoints(req, res);

});

// remove points
router.delete('/:id', [auth, validateObjectId], (req, res) => {

  pointsController.removePoints(req, res);

});


// // get current user
// router.get('/me', auth, (req, res) => {

//   pointsController.getCurrentUser(req, res);

// });

// // get all users
// router.get('/', auth, (req, res) => {

//   pointsController.getAllUsers(req, res);

// });

// // get user by id
// router.get('/:id', [auth, validateObjectId], (req, res) => {

//   pointsController.getUserById(req, res);

// });

// // add new user
// router.post('/', auth, (req, res) => {

//   pointsController.addNewUser(req, res);

// });

// // edit user
// router.put('/:id', [auth, validateObjectId], (req, res) => {

//   pointsController.editUser(req, res);

// });

// // delete user
// router.delete('/:id', [auth, validateObjectId], (req, res) => {

//   pointsController.deleteUser(req, res);

// });

module.exports = router;
