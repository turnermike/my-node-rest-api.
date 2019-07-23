/**
 * tests/unit/models/user.test.js
 *
 *
 */

const path = require('path');
const mongoose = require('mongoose');
const request = require('supertest');
const { Users } = require('../../../models/users');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv-safe').config({ path: path.resolve(process.cwd(), '.env.test') });

// console.log('dotenv', dotenv);
// console.log('path', path.resolve(process.cwd(), '.env.test'));

let server;

describe('/api/users', () => {

  beforeEach(() => {

    server = require('../../../index');   // start the express server before each gest

  });

  afterEach(async () => {

    await server.close();               // stop server
    await Users.deleteMany({});         // remove the users table
  });

  // generate jwt
  describe('user.generateAuthToken()', () => {

    it('Should return a valid JWT.', () => {

      const payload = {
        _id: new mongoose.Types.ObjectId().toHexString()
      }
      const user = new Users(payload);
      const token = user.generateAuthToken();
      const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

      expect(decoded).toMatchObject(payload);
      // console.log(decoded);

    });

  });

  // get all users
  describe('GET /', () => {

    it('Should return all users.', async () => {

      await Users.collection.insertMany([
        { email: 'email1@domain.com' },
        { email: 'email2@domain.com' }
      ]);

      const res = await request(server).get('/api/users');

    });

  });

});



