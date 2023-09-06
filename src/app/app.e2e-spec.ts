import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { sql } from 'kysely';

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
    await sql`truncate table ${sql.table('user')}`.execute(database);
    await database.destroy();
    await app.close();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer()).get('/health').expect(200);
  });

  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'foosc1@wp.pl',
        password: 'Foo-1234',
      })
      .expect(201);
  });
});
