import * as supertest from 'supertest';
import { dbConnector, TEST_DB } from '../database/db.connector';
import { createApp } from '../../main';
import { MongoClient } from 'mongodb';

describe('/auth', () => {
  let ST: supertest.SuperTest<supertest.Test>;
  let client: MongoClient;

  beforeAll(() => {
    return dbConnector.getClient().then((clientDb) => {
      client = clientDb;
      createApp().then((app) => {
        ST = supertest(app);
      });
    });
  });

  afterEach(async () => {
    return await client.db(TEST_DB).dropDatabase();
  });

  afterAll(async () => {
    return await client.close(true);
  });
  describe('POST /register', () => {
    const user = {
      email: 'a@a.com',
      password: 'password',
    };
    it('Should register', async () => {
      await ST.post('/auth/register')
        .send(user)
        .expect(201)
        .expect('Authorization', /^Bearer /)
        .then(({ body, headers: { authorization } }) => {
          expect(body.email).toBe(user.email);
          expect(body.password).toBe(undefined);
          expect(authorization).toMatch(/^Bearer /);
        });
    });

    it('Should not register if email already exist', async () => {
      await ST.post('/auth/register').send(user);
      await ST.post('/auth/register')
        .send(user)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe('auth/already-exist');
        });
    });

    it('Should not register if no email is supplied', async () => {
      await ST.post('/auth/register')
        .send({ ...user, email: null })
        .expect(400)
        .then((response) => {
          expect(response.body.errors).toBeTruthy;
          expect(response.body.errors[0].msg).toBe('must be an email');
          expect(response.body.errors[0].param).toBe('email');
        });
    });

    it('Should not register if no password is supplied or if length < 7', async () => {
      await ST.post('/auth/register')
        .send({ ...user, password: null })
        .expect(400)
        .then((response) => {
          expect(response.body.errors).toBeTruthy;
          expect(response.body.errors[0].msg).toBe(
            'Password should be at least 7 chars long'
          );
          expect(response.body.errors[0].param).toBe('password');
        });
    });
  });

  describe('POST /login', () => {
    const user = {
      email: 'a@a.com',
      password: 'password',
    };
    it('Should login', async () => {
      await ST.post('/auth/register').send(user).expect(201);
      await ST.post('/auth/login')
        .send(user)
        .expect(200)
        .expect('Authorization', /^Bearer /)
        .then(({ body, headers: { authorization } }) => {
          expect(body.email).toBe(user.email);
          expect(body.password).toBe(undefined);
          expect(authorization).toMatch(/^Bearer /);
        });
    });

    it('Should not login if email is not found', async () => {
      await ST.post('/auth/register').send(user).expect(201);
      await ST.post('/auth/login')
        .send({ email: 'aa@a.com', password: 'password' })
        .expect(401)
        .then((response) => {
          expect(response.body.error).toBe('Unauthorized');
          console.log(response.body.error);
        });
    });
  });
});
