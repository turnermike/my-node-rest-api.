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
    let thepoints;
    let action;

    const exec = async () => {                  // send async request to server

      const points = new Points({               // points object to pass asyncronously
        _user: {
          _id: userId,
          _email: email
        },
        points: thepoints,
        action: action
      });

      console.log('points object sent from test', points);
      // console.log('userId', userId);

      const res = await request(server)
        .post(`/api/points/${userId}`)
        .set('x-auth-token', token)
        .send(points);

      return res;

    };

    beforeEach(async () => {

      server = require('../../../index');       // start server before each test
      token = new Users().generateAuthToken();  // get a jwt auth token
      email = 'email@domain.com';               // fake email
      // userId = new mongoose.Types.ObjectId();   // fake userId
      thepoints = 999;                          // fake points
      // action = 'my-action';                     // fake action


      // create fake user
      const user = new Users({
        email: 'email@domain.com',
        password: 'password',
        firstName: 'Mike',
        lastName: 'Turner',
        _userRole: {
          _id: new mongoose.Types.ObjectId(),
          label: 'My Label',
          level: 1
        }
      });
      await user.save();                        // save fake user to db

      userId = user._id;                        // assign userId

    });

    afterEach(async () => {                     // executed after each test

      await server.close();                     // stop express
      await Users.deleteMany({});               // remove users table after each test
      // await Roles.deleteMany({});


    });

    it('Should return 401 if user is not logged in.', async () => {

      token = '';
      const res = await exec();

      expect(res.status).toBe(401);

    });

    it('Should return 400 if no points value is provided.', async () => {

      thepoints = null;

      const res = await exec();

      expect(res.status).toBe(400);

    });

    // it('Should return 400 if action is not add, remove, or transfer.', async () => {

    // });

    // it('Should return 200 if points where added successfully.', async () => {

    //   thepoints = 5;
    //   // action = 'add';

    //   const res = await exec();
    //   // console.log('res', res);

    //   expect(res.status).toBe(200);

    //   // console.log('HELLO');

    // });


  });

  // // delete requests
  // describe('DELETE Requests', () => {


  //   let token;
  //   let email;
  //   let userId;
  //   let thepoints;
  //   let action;

  //   const exec = async () => {                  // send async request to server

  //     const points = new Points({               // points object to pass asyncronously
  //       _user: {
  //         _id: userId,
  //         _email: email
  //       },
  //       points: thepoints,
  //       action: action
  //     });

  //     console.log('points object', points);

  //     const res = await request(server)
  //       .delete(`/api/points/${userId}`)
  //       .set('x-auth-token', token)
  //       .send(points);

  //     return res;

  //   };

  //   beforeEach(async () => {
  //     server = require('../../../index');       // start server before each test
  //     token = new Users().generateAuthToken();  // get a jwt auth token
  //     email = 'email@domain.com';               // fake email
  //     // userId = new mongoose.Types.ObjectId();   // fake userId
  //     thepoints = 999;                          // fake points
  //     action = 'my-action';                     // fake action

  //     // create fake user
  //     const user = new Users({
  //       email: 'email@domain.com',
  //       password: 'password',
  //       firstName: 'Mike',
  //       lastName: 'Turner',
  //       _userRole: {
  //         _id: new mongoose.Types.ObjectId(),
  //         label: 'My Label',
  //         level: 1
  //       }
  //     });
  //     await user.save();                        // save fake user to db

  //     userId = user._id;                        // assign userId

  //   });

  //   afterEach(async () => {                     // executed after each test

  //     await server.close();                     // stop express
  //     await Users.deleteMany({});               // remove users table after each test
  //     // await Roles.deleteMany({});

  //   });

  //   it('Should return 401 if user is not logged in.', async () => {

  //     token = '';
  //     const res = await exec();

  //     expect(res.status).toBe(401);

  //   });

  //   it('Should return 400 if no points value is provided.', async () => {

  //     thepoints = null;

  //     const res = await exec();

  //     expect(res.status).toBe(400);

  //   });


  // });

});