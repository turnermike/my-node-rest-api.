/**
 * routes/users.js
 *
 * User routes calling User controller.
 *
 */

const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

// get current user
router.get('/me', (req, res) => {

  usersController.getCurrentUser(req, res);

});

// get all users
router.get('/', (req, res) => {

  usersController.getAllUsers(req, res);

});

// get user by id
router.get('/:id', (req, res) => {

  usersController.getUserById(req, res);

});

// add new user
router.post('/', (req, res) => {

  usersController.addNewUser(req, res);

});

// edit user
router.put('/:id', (req, res) => {

  usersController.editUser(req, res);

});

// delete user
router.delete('/:id', (req, res) => {

  usersController.deleteUser(req, res);

});

module.exports = router;
