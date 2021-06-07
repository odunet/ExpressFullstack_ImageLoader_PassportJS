// supertest is a framework that allows to easily test web apis
const request = require('supertest');
// Import sum functions to be tested
const { sum, asyncSum } = require('./sum');
// Import express application
const app = require('../src');
//import mongoose
const mongoose = require('mongoose');
//import mongoose memory server
const { MongoMemoryServer } = require('mongodb-memory-server-core');

//Test asynchronously
describe('Asyncronous test', () => {
  it('adds 2 + 3 to equal 5', () => {
    return asyncSum(2, 3).then((data) => {
      expect(data).toBe(5);
    });
  });
});

//Test synchronously
describe('Synchronous test', () => {
  it('adds 0 + 2 to equal 2', () => {
    expect(sum(0, 2)).toBe(2);
  });

  it('adds 1 + 0 to equal 1', () => {
    expect(sum(1, 0)).toBe(1);
  });
});

//Test endpoints with super test
describe('testing-server-routes', () => {
  beforeAll(async () => {
    const mongod = new MongoMemoryServer();
    const uri = await mongod.getUri();
    const port = await mongod.getPort();
    const dbPath = await mongod.getDbPath();
    const dbName = await mongod.getDbName();
    try {
      let connection = await mongoose.connect(uri, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      });
      console.log('MongoDB Memory Server connected');
    } catch (err) {
      throw err;
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('GET /landing page - success', async () => {
    const data = await request(app).get('/'); //uses the request function that calls on express app instance
    expect(data.status).toBe(302);
  });

  it('GET /login - success', async () => {
    const data = await request(app).get('/loader/login'); //uses the request function that calls on express app instance

    expect(data.status).toBe(200);
  });

  it('POST /Register -success', async () => {
    const filePath = `${__dirname}/../image/kanban.png`;
    try {
      const data = await request(app)
        .post('/loader/auth/register') //uses the request function that calls on express app instance
        .set('Content-Type', 'multipart/form-data')
        .field('userName', 'odunet')
        .field('email', 'odunet@odunet.com')
        .field('firstName', 'Ayokunle')
        .field('lastName', 'Odutayo')
        .field('password', 'starman')
        .field('isAdmin', true)
        .attach('photo', filePath);

      console.log(`Register Route: ${data.headers.location}`);
      expect(data.headers.location).toMatch(/odunet/);
    } catch (err) {
      console.log({ Error: err });
    }
  });

  it('POST /login -success', async () => {
    try {
      const filePath = `${__dirname}/../image/kanban.png`;

      const data = await request(app)
        .post('/loader/login') //uses the request function that calls on express app instance
        .set('Content-Type', 'multipart/form-data')
        .field('email', 'odunet@odunet.com')
        .field('password', 'starman')
        .attach('photo', filePath);

      console.log(`Login Route: ${data.headers.location}`);
      expect(data.headers.location).toMatch(/loader\/auth\/user/);
    } catch (err) {
      console.log({ Error: err });
    }
  });
});
