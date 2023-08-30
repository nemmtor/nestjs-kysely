import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from 'src/app';
import { Database } from 'src/database';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let database: Database;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    database = app.get(Database);
    await app.init();
  });

  afterEach(async () => {
    await database.destroy();
    await app.close();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer()).get('/health').expect(200);
  });
});
