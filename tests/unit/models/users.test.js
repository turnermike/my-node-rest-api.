/**
 * tests/unit/models/user.test.js
 *
 *
 */

const path = require('path');
const dotenv = require('dotenv-safe').config({ path: path.resolve(process.cwd(), '.env.test') });
const mongoose = require('mongoose');
// const request = require('supertest');
const { Users } = require('../../../models/users');
// const logger = require('../../../middleware/logger');
const jwt = require('jsonwebtoken');


// console.log('dotenv', dotenv);
// console.log('path', path.resolve(process.cwd(), '.env.test'));

// let server;x

describe('/api/users', () => {

  // beforeEach(() => {

  //   server = require('../../../index');                                           // start the express server before each gest

  // });

  // afterEach(async () => {

  //   await server.close();                                                         // stop server

  // });

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


});



