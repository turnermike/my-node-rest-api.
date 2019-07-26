/**
 * test/integration/genres.test.js
 *
 *
 */

const path = require('path');
require('dotenv-safe').config({ path: path.resolve(process.cwd(), '.env.test') });
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const bcrypt = require('bcrypt');
const request = require('supertest');
const { Users } = require('../../../models/users');
const { Roles } = require('../../../models/roles');

let server;
let token;

describe('/api/users', () => {


  // get requests
  describe('GET Requests', () => {

    const exec = async () => {                  // send async request to server
      // console.log('called exec', token);
      const res = await request(server)
        .get('/api/users')
        .set('x-auth-token', token)
        .send();
      return res;
    }

    beforeEach(() => {                          // executed before each test

      server = require('../../../index');       // start server before each test
      token = new Users().generateAuthToken();  // generate auth token

    });

    afterEach(async () => {                     // executed after each test

      await server.close();                     // stop express
      await Users.deleteMany({});               // remove users table after each test

    });

    it('Should return 401 is user is not logged in.', async () => {

      token = '';

      const res = await exec();

      expect(res.status).toBe(401);

    });

    // get current user
    describe('GET /me', () => {

      it('Should return 200 if user is found', async () => {

        // fake current user
        const user = new Users({
          email: 'email@domain.com',
          password: 'password',
          firstName: 'Mike',
          lastName: 'Turner',
          userRole: {
            _id: new mongoose.Types.ObjectId(),
            label: 'My Label',
            level: 1
          }
        });
        await user.save();

        // send async get request
        const res = await request(server)
          .get('/api/users/' + user._id)
          .set('x-auth-token', token)
          .send();

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('email', user.email);

      });

    });

    // get all users
    describe('GET /', () => {

      it('Should return all users.', async () => {

        await Users.collection.insertMany([                            // insert 2 test records
            { email: 'email1@domain.com' },
            { email: 'email2@domain.com' }
        ]);

        const res = await exec();                                                   // make the get request
        // console.log('res', res.body);

        expect(res.status).toBe(200);                                               // test expects a 200 response code
        expect(res.body.length).toBe(2);                                            // test expects 2 results
        expect(res.body.some(g => g.email === 'email1@domain.com')).toBeTruthy();   // test expects an object with a name proper of 'genre1'
        expect(res.body.some(g => g.email === 'email2@domain.com')).toBeTruthy();   // test expects an object with a name proper of 'genre2'

      });

    });

    // get user by id
    describe('GET /:id', () => {

      it('Should return a user if valid id passed.', async () => {

        const user = new Users({
          email: 'email@domain.com',
          password: 'password',
          firstName: 'Mike',
          lastName: 'Turner',
          userRole: {
            _id: new mongoose.Types.ObjectId(),
            label: 'My Label',
            level: 1
          }
        });
        await user.save();

        // send async get request
        const res = await request(server)
          .get('/api/users/' + user._id)
          .set('x-auth-token', token)
          .send();

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('email', user.email);

      });

    });

  });

  // post requests
  describe('POST Requests', () => {

    // let token;
    // let email;


    const exec = async () => {                  // send async request to server

      const user = new Users({
        email,
        password: 'Password$1',
        firstName: 'First',
        lastName: 'Last',
        telephone: '123 456 7890',
        organizationName: 'Org Name',
        userRole: {
          // _id: mongoose.Types.ObjectId(),
          _id: '5d376784a854b86b1a4e7b6a',
          label: 'Guest',
          level: 2
        }
      });

      const res = await request(server)
        .post('/api/users')
        .set('x-auth-token', token)
        .send(user);
      // console.log('res 1', res.status);

      return res;

    };

    beforeEach(() => {
      server = require('../../../index');       // start server before each test
      token = new Users().generateAuthToken();
      email = 'email@domain.com';
    });

    afterEach(async () => {                     // executed after each test

      await server.close();                     // stop express
      await Users.deleteMany({});               // remove users table after each test
      await Roles.deleteMany({});

    });

    it('Should return 401 if user is not logged in.', async () => {

      token = '';
      const res = await exec();

      expect(res.status).toBe(401);

    });

    it('Should save the user if valid', async () => {

      // insert a dummy role to use with this test user
      const role = new Roles({
        label: 'My Role',
        level: 1
      });

      await role.save();
      // console.log('role._id', role._id);

      // hash password
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash('Password$1', salt);

      // prepare test user object
      const user = new Users({
        email: 'email@domain.com',
        password,
        firstName: 'First',
        lastName: 'Last',
        telephone: '012 345 6789',
        organizationName: 'My Org',
        userRole: { _id: role.id }
      });

      const res = await request(server)
        .post('/api/users')
        .set('x-auth-token', token)
        .send(user);
      // console.log('res.text', res.text);

      expect(res).not.toBeNull();

    });

  });

});