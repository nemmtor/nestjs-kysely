import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { cleanUp, setupApp } from 'src/test-utils';
import { ConfigService } from 'src/config';

describe('Killswitch', () => {
  let app: INestApplication;
  let configService: ConfigService;

  beforeEach(async () => {
    app = await setupApp();

    configService = app.get(ConfigService);

    await app.init();
  });

  afterEach(async () => {
    await cleanUp(app);
  });

  describe('throws unauthorised exception on', () => {
    it('missing admin token', async () => {
      await request(app.getHttpServer()).get('/v1/killswitch/on').expect(401);

      await request(app.getHttpServer()).get('/v1/killswitch/off').expect(401);
    });

    it('invalid admin token', async () => {
      await request(app.getHttpServer())
        .get('/v1/killswitch/on')
        .set({
          Authorization: 'Bearer invalid',
        })
        .expect(401);

      await request(app.getHttpServer())
        .get('/v1/killswitch/off')
        .set({
          Authorization: 'Bearer invalid',
        })
        .expect(401);
    });
  });

  it('turns on/off maintenance mode', async () => {
    const adminToken = `Bearer ${configService.get('application').adminToken}`;

    await request(app.getHttpServer())
      .get('/v1/killswitch/on')
      .set({
        Authorization: adminToken,
      })
      .expect(200);

    await request(app.getHttpServer()).get('/v1/health').expect(503);

    await request(app.getHttpServer())
      .get('/v1/killswitch/off')
      .set({
        Authorization: adminToken,
      })
      .expect(200);

    await request(app.getHttpServer()).get('/v1/health').expect(200);
  });
});
