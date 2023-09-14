import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { cleanUp, setupApp } from 'src/test-utils';

describe('Auth', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await setupApp();

    await app.init();
  });

  afterEach(async () => {
    await cleanUp(app);
  });
  describe('register', () => {
    describe('is successfull on', () => {
      it('correct payload', () => {
        return request(app.getHttpServer())
          .post('/v1/auth/register')
          .send({
            email: 'john@example.com',
            password: 'password',
          })
          .expect(201);
      });
    });

    describe('throws bad request error on', () => {
      it('empty payload', () => {
        return request(app.getHttpServer())
          .post('/v1/auth/register')
          .expect(400);
      });

      it('invalid email', () => {
        return request(app.getHttpServer())
          .post('/v1/auth/register')
          .send({
            email: 'john',
            password: 'password',
          })
          .expect(400);
      });

      it('too simple password', () => {
        return request(app.getHttpServer())
          .post('/v1/auth/register')
          .send({
            email: 'john@example.com',
            password: 'pw',
          })
          .expect(400);
      });
    });

    describe('throws conflict on', () => {
      it('email already in user', async () => {
        await request(app.getHttpServer())
          .post('/v1/auth/register')
          .send({
            email: 'john@example.com',
            password: 'password',
          })
          .expect(201);

        return request(app.getHttpServer())
          .post('/v1/auth/register')
          .send({
            email: 'john@example.com',
            password: 'password',
          })
          .expect(409);
      });
    });
  });

  describe('login', () => {
    describe('is successfull on', () => {
      it('correct payload', async () => {
        await request(app.getHttpServer())
          .post('/v1/auth/register')
          .send({
            email: 'john@example.com',
            password: 'password',
          })
          .expect(201);

        return request(app.getHttpServer())
          .post('/v1/auth/login')
          .send({
            email: 'john@example.com',
            password: 'password',
          })
          .expect(201);
      });

      describe('throws unauthorized error on', () => {
        it('wrong payload', () => {
          return request(app.getHttpServer())
            .post('/v1/auth/login')
            .send({
              username: 'john',
              password: 'password',
            })
            .expect(401);
        });

        it('non existing user', () => {
          return request(app.getHttpServer())
            .post('/v1/auth/login')
            .send({
              username: 'nonexisting@example.com',
              password: 'password',
            })
            .expect(401);
        });
      });
    });
  });
});
