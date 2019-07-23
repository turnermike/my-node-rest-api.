/**
 * test/integration/genres.test.js
 *
 *
 */

const path = require('path');
require('dotenv-safe').config({ path: path.resolve(process.cwd(), '.env.test') });
const mongoose = require('mongoose');
// const ObjectID = require('mongodb').ObjectID;
const request = require('supertest');
const { Users } = require('../../../models/users');

let server;
let token;

describe('/api/users', () => {

  beforeEach(() => {                          // executed before each test

    server = require('../../../index');       // start server before each test
    token = new Users().generateAuthToken();  // generate auth token

  });

  afterEach(async () => {                     // executed after each test

    await server.close();                     // stop express
    await Users.deleteMany({});               // remove users table after each test

  });

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

    it('Should return 401 is user is not logged in.', async () => {

      token = '';

      const res = await exec();

      expect(res.status).toBe(401);

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




});