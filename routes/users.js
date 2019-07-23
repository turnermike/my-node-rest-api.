/**
 * routes/users.js
 *
 * User routes calling User controller.
 *
 */

const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const auth = require('../middleware/auth');

// get current user
router.get('/me', (req, res) => {

  usersController.getCurrentUser(req, res);

});

// get all users
router.get('/', auth, (req, res) => {

  usersController.getAllUsers(req, res);

});

// get user by id
router.get('/:id', auth, (req, res) => {

  usersController.getUserById(req, res);

});

// add new user
router.post('/', auth, (req, res) => {

  usersController.addNewUser(req, res);

});

// edit user
router.put('/:id', auth, (req, res) => {

  usersController.editUser(req, res);

});

// delete user
router.delete('/:id', auth, (req, res) => {

  usersController.deleteUser(req, res);

});

module.exports = router;
