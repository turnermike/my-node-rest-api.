/**
 * routes/users.js
 *
 * User routes calling User controller.
 * /api/users
 *
 */

const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');

// get current user
router.get('/me', auth, (req, res) => {

  usersController.getCurrentUser(req, res);

});

// get all users
router.get('/', auth, (req, res) => {

  usersController.getAllUsers(req, res);

});

// get user by id
router.get('/:id', [auth, validateObjectId], (req, res) => {

  usersController.getUserById(req, res);

});

// add new user
router.post('/', auth, (req, res) => {

  usersController.addNewUser(req, res);

});

// edit user
router.put('/:id', [auth, validateObjectId], (req, res) => {

  usersController.editUser(req, res);

});

// delete user
router.delete('/:id', [auth, validateObjectId], (req, res) => {

  usersController.deleteUser(req, res);

});

module.exports = router;
