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

  describe('me', () => {
    describe('is successfull on', () => {
      it('correct payload', async () => {
        await request(app.getHttpServer())
          .post('/v1/auth/register')
          .send({
            email: 'john@example.com',
            password: 'password',
          })
          .expect(201);

        const response = await request(app.getHttpServer())
          .post('/v1/auth/login')
          .send({
            email: 'john@example.com',
            password: 'password',
          })
          .expect(201);

        return request(app.getHttpServer())
          .get('/v1/auth/me')
          .set({
            Authorization: `Bearer ${response.body.accessToken}`,
          })
          .expect(200);
      });
    });

    describe('throws unauthorized error on', () => {
      it('wrong token', () => {
        return request(app.getHttpServer())
          .get('/v1/auth/me')
          .set({
            Authorization: 'Bearer invalid',
          })
          .expect(401);
      });
    });
  });

  describe('refresh', () => {
    describe('is successfull on', () => {
      it('correct payload', async () => {
        await request(app.getHttpServer())
          .post('/v1/auth/register')
          .send({
            email: 'john@example.com',
            password: 'password',
          })
          .expect(201);

        const response = await request(app.getHttpServer())
          .post('/v1/auth/login')
          .send({
            email: 'john@example.com',
            password: 'password',
          })
          .expect(201);

        // so the token is not the same
        await new Promise((r) => setTimeout(r, 2000));

        return request(app.getHttpServer())
          .post('/v1/auth/refresh')
          .send({
            refreshToken: response.body.refreshToken,
          })
          .expect(201);
      });
    });

    describe('throws unauthorized error on', () => {
      it('wrong token', async () => {
        return request(app.getHttpServer())
          .post('/v1/auth/refresh')
          .send({
            refreshToken: 'invalid',
          })
          .expect(401);
      });

      it('token reuse', async () => {
        await request(app.getHttpServer())
          .post('/v1/auth/register')
          .send({
            email: 'john@example.com',
            password: 'password',
          })
          .expect(201);

        const loginResponse = await request(app.getHttpServer())
          .post('/v1/auth/login')
          .send({
            email: 'john@example.com',
            password: 'password',
          })
          .expect(201);

        // so the token is not the same
        await new Promise((r) => setTimeout(r, 2000));

        await request(app.getHttpServer())
          .post('/v1/auth/refresh')
          .send({
            refreshToken: loginResponse.body.refreshToken,
          })
          .expect(201);

        return request(app.getHttpServer())
          .post('/v1/auth/refresh')
          .send({
            refreshToken: loginResponse.body.refreshToken,
          })
          .expect(401);
      });

      it('using fresh token after token reuse', async () => {
        await request(app.getHttpServer())
          .post('/v1/auth/register')
          .send({
            email: 'john@example.com',
            password: 'password',
          })
          .expect(201);

        const loginResponse = await request(app.getHttpServer())
          .post('/v1/auth/login')
          .send({
            email: 'john@example.com',
            password: 'password',
          })
          .expect(201);

        // so the token is not the same
        await new Promise((r) => setTimeout(r, 2000));

        const refreshResponse = await request(app.getHttpServer())
          .post('/v1/auth/refresh')
          .send({
            refreshToken: loginResponse.body.refreshToken,
          })
          .expect(201);

        await request(app.getHttpServer())
          .post('/v1/auth/refresh')
          .send({
            refreshToken: loginResponse.body.refreshToken,
          })
          .expect(401);

        await request(app.getHttpServer())
          .post('/v1/auth/refresh')
          .send({
            refreshToken: refreshResponse.body.refreshToken,
          })
          .expect(401);
      });
    });
  });
});
