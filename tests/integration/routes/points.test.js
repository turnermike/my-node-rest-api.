/**
 * test/integration/points.test.js
 *
 *
 */

const path = require('path');
require('dotenv-safe').config({ path: path.resolve(process.cwd(), '.env.test') });
const mongoose = require('mongoose');
// const ObjectID = require('mongodb').ObjectID;
// const bcrypt = require('bcrypt');
const request = require('supertest');
const { Users } = require('../../../models/users');
// const { Roles } = require('../../../models/roles');
const { Points } = require('../../../models/points');

let server;
let token;

describe('/api/points/:id', () => {

  // post requests
  describe('POST Requests', () => {

    let token;
    let email;
    let userId;

    const exec = async () => {                  // send async request to server

      const points = new Points({
        _user: {
          _id: new mongoose.Types.ObjectId(),
          _email: email
        },
        points: 123,
        action: 'add'
      });

      const res = await request(server)
        .post(`/api/points/${userId}`)
        .set('x-auth-token', token)
        .send(points);
      // console.log('res 1', res.status);

      return res;

    };

    beforeEach(() => {
      server = require('../../../index');       // start server before each test
      token = new Users().generateAuthToken();  // get a jwt auth token
      email = 'email@domain.com';               // fake email
      userId = new mongoose.Types.ObjectId();   // fake userId
    });

    afterEach(async () => {                     // executed after each test

      await server.close();                     // stop express
      // await Users.deleteMany({});               // remove users table after each test
      // await Roles.deleteMany({});

    });

    it('Should return 401 if user is not logged in.', async () => {

      token = '';
      const res = await exec();

      expect(res.status).toBe(401);

    });


  });

});