/**
 * controllers/auth.js
 *
 * Authorization controller processing Auth routes.
 *
 * Messaging prefix conventions:
 * AUTH: ... for CRUD operations.
 * No prefix for standard info logs.
 *
 */

const { Users, validateAUTH } = require('../models/users');
const bcrypt = require('bcrypt');
const logger = require('../middleware/logger');

/**
 * login/authenticate user
 */
exports.getAuth = async function(req, res) {

  // validate
  const { error } = validateAUTH(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check for existing user
  let user = await Users.findOne({ email: req.body.email });
  if (! user) return res.status(400).send('Invalid email or password');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (! validPassword) return res.status(400).send('Invalid email or password');

  const token = user.generateAuthToken();

  logger.info(`AUTH: User successfully authenticated: ${req.body.email}`)

  // res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email', 'isAdmin']));           // use _.pick to select with properties to send
  // res.header('x-auth-token', token).send(token);
  res.send(token);
  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDMyMDMwZTZhMDk1ZjUwZDcwYjg3ZWUiLCJpYXQiOjE1NjM4MjYyMjR9.3vvjKuI7I7brTZ33mfd60h7zvR1qfcFwB2EMvZO55Aw

}