import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { cleanUp, setupApp } from 'src/test-utils';

describe('Health', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await setupApp();

    await app.init();
  });

  afterEach(async () => {
    await cleanUp(app);
  });

  it('runs successfull healthcheck', () => {
    return request(app.getHttpServer()).get('/v1/health').expect(200);
  });
});
