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

  // get all users
  describe('GET /', () => {

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

    it('Should return all users.', async () => {

      await Users.collection.insertMany([                            // insert 2 test records
          { email: 'email1@domain.com' },
          { email: 'email2@domain.com' }
      ]);

      // await Users.insertMany([                            // insert 2 test records
      //   {
      //     email: 'email1@domain.com',
      //     password: 'Password$1',
      //     firstName: 'First Name 1',
      //     lastName: 'Last Name 1',
      //     userRole: {
      //       _id: new mongoose.Types.ObjectId().toHexString(),
      //       label: 'Role 1',
      //       level: 1
      //     }
      //   },
      //   {
      //     email: 'email2@domain.com',
      //     password: 'Password$1',
      //     firstName: 'First Name 2',
      //     lastName: 'Last Name 2',
      //     userRole: {
      //       _id: new mongoose.Types.ObjectId().toHexString(),
      //       label: 'Role 2',
      //       level: 2
      //     }
      //   }
      // ]);

      // const res = await request(server).get('/api/users');           // make get request
      const res = await exec();
      // console.log('res', res.body);

      expect(res.status).toBe(200);                                   // test expects a 200 response code
      expect(res.body.length).toBe(2);                                // test expects 2 results
      expect(res.body.some(g => g.email === 'email1@domain.com')).toBeTruthy();   // test expects an object with a name proper of 'genre1'
      expect(res.body.some(g => g.email === 'email2@domain.com')).toBeTruthy();   // test expects an object with a name proper of 'genre2'

    });

  });

    // // get genre by id
    // describe('GET /:id', () => {

    //     it('Should return a genre if valid id is passed.', async () => {

    //         const genre = new Genres({ name: 'genre1' });                   // new genre
    //         await genre.save();                                             // save it to database
    //         // console.log('genre', genre);

    //         const res = await request(server).get('/api/genres/' + genre._id);  // make get request with id parameter
    //         // console.log('res.body', res.body);

    //         expect(res.status).toBe(200);                                   // test for 200 response code
    //         expect(res.body).toHaveProperty('name', genre.name);            // test for object property 'name' with value of 'genre1'

    //     });

    //     it('Should return 404 if invalid id is passed.', async () => {
    //         const id = mongoose.Types.ObjectId();
    //         const res = await request(server).get('/api/genres/' + id);         // make get request with an invalid id (1)
    //         expect(res.status).toBe(404);                                   // test for 200 response code
    //         // expect(res.body).toHaveProperty('name', genre.name);            // test for object property 'name' with value of 'genre1'

    //     });

    // });

    // // insert new genre
    // describe('POST /', () => {


    //     let token;
    //     let name;

    //     // define the happy path, and then in each test we change
    //     // one parameter that clearly aligns with the name of the test.
    //     const exec = async () => {
    //         const res = await request(server)                       // send post request
    //             .post('/api/genres')                                // post path/url
    //             .set('x-auth-token', token)                         // set header key/value
    //             .send({ name });                                    // url parameters
    //         return res;
    //     }

    //     // runs before each test
    //     beforeEach(() => {
    //         token = new Users().generateAuthToken(),                // generate JWT
    //         name = 'genre1'                                         // default name value

    //     });

    //     it('Should return 401 if user is not logged in.', async () => {

    //         token = '';                                             // testing a logged out user, unset token

    //         const res = await exec();                               // execute post request

    //         expect(res.status).toBe(401);                           // test expects a 401 response code

    //     });

    //     it('Should return 400 if genre is less than 5 characters', async () => {

    //         name = '1234';                                          // testing an invalid name, do not use the default defined above

    //         const res = await exec();                               // execute post request

    //         expect(res.status).toBe(400);                           // test expects a 400 response code

    //     });

    //     it('Should return 400 if genre is more than 50 characters', async () => {

    //         name = new Array(52).join('a');                         // testing a long name string, generate a 52 char string

    //         const res = await exec();                               // execute post request

    //         expect(res.status).toBe(400);                           // test expects a 400 response code

    //     });

    //     it('Should save the genre if it is valid', async () => {

    //         await exec();                                           // execute post request

    //         const genre = await Genres.find({ name: 'genre1' });    // check database for new genre

    //         expect(genre).not.toBeNull();                           // test expects not null genre

    //     });

    //     it('Should return the genre if it is valid', async () => {

    //         const res = await exec();                               // execute post request

    //         expect(res.body).toHaveProperty('_id');                 // test expects res.body to have an _id property
    //         expect(res.body).toHaveProperty('name', 'genre1');      // test expects res.body to have a name property with value 'genre1'

    //     });

    // });

    // // update a genre
    // describe('PUT /:id', () => {

    //     let token;
    //     let newName;
    //     let genre;
    //     let id;

    //     const exec = async () => {
    //       return await request(server)
    //         .put('/api/genres/' + id)
    //         .set('x-auth-token', token)
    //         .send({ name: newName });
    //     }

    //     beforeEach(async () => {
    //       // Before each test we need to create a genre and
    //       // put it in the database.
    //       genre = new Genres({ name: 'genre1' });
    //       await genre.save();

    //       token = new Users().generateAuthToken();
    //       id = genre._id;
    //       newName = 'updatedName';
    //     })

    //     it('should return 401 if client is not logged in', async () => {
    //       token = '';

    //       const res = await exec();

    //       expect(res.status).toBe(401);
    //     });

    //     it('should return 400 if genre is less than 5 characters', async () => {
    //       newName = '1234';

    //       const res = await exec();

    //       expect(res.status).toBe(400);
    //     });

    //     it('should return 400 if genre is more than 50 characters', async () => {
    //       newName = new Array(52).join('a');

    //       const res = await exec();

    //       expect(res.status).toBe(400);
    //     });

    //     it('should return 404 if id is invalid', async () => {
    //       // id = 1;
    //       id = new ObjectID(1);

    //       const res = await exec();

    //       expect(res.status).toBe(404);
    //     });

    //     it('should return 404 if genre with the given id was not found', async () => {
    //       id = mongoose.Types.ObjectId();

    //       const res = await exec();

    //       expect(res.status).toBe(404);
    //     });

    //     it('should update the genre if input is valid', async () => {
    //       await exec();

    //       const updatedGenre = await Genres.findById(genre._id);

    //       expect(updatedGenre.name).toBe(newName);
    //     });

    //     it('should return the updated genre if it is valid', async () => {
    //       const res = await exec();

    //       expect(res.body).toHaveProperty('_id');
    //       expect(res.body).toHaveProperty('name', newName);
    //     });

    // });

    // // delete a genre
    // describe('DELETE /:id', () => {

    //     let token;
    //     let genre;
    //     let id;

    //     const exec = async () => {
    //       return await request(server)
    //         .delete('/api/genres/' + id)
    //         .set('x-auth-token', token)
    //         .send();
    //     }

    //     beforeEach(async () => {
    //       // Before each test we need to create a genre and
    //       // put it in the database.
    //       genre = new Genres({ name: 'genre1' });
    //       await genre.save();

    //       id = genre._id;
    //       token = new Users({ isAdmin: true }).generateAuthToken();
    //     })

    //     it('should return 401 if client is not logged in', async () => {
    //       token = '';

    //       const res = await exec();

    //       expect(res.status).toBe(401);
    //     });

    //     it('should return 403 if the user is not an admin', async () => {
    //       token = new Users({ isAdmin: false }).generateAuthToken();

    //       const res = await exec();

    //       expect(res.status).toBe(403);
    //     });

    //     it('should return 404 if id is invalid', async () => {
    //       // id = 1;
    //       id = new ObjectID(1);

    //       const res = await exec();

    //       expect(res.status).toBe(404);
    //     });

    //     it('should return 404 if no genre with the given id was found', async () => {
    //       id = mongoose.Types.ObjectId();

    //       const res = await exec();

    //       expect(res.status).toBe(404);
    //     });

    //     it('should delete the genre if input is valid', async () => {
    //       await exec();

    //       const genreInDb = await Genres.findById(id);

    //       expect(genreInDb).toBeNull();
    //     });

    //     it('should return the removed genre', async () => {
    //       const res = await exec();

    //       expect(res.body).toHaveProperty('_id', genre._id.toHexString());
    //       expect(res.body).toHaveProperty('name', genre.name);
    //     });

    // });

});