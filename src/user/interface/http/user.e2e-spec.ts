import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { cleanUpAfterTests, setupAppForTests } from 'src/test-utils';

import { UserError } from '../../domain';

describe('User http interface', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await setupAppForTests();

    await app.init();
  });

  afterEach(async () => {
    await cleanUpAfterTests(app);
  });

  describe('findById', () => {
    describe('responds with not found error on', () => {
      it('non existing user id parameter', async () => {
        const response = await request(app.getHttpServer())
          .get('/v1/users/e3edfddc-5209-4131-ae91-8f75a6ebdf45')
          .expect(404);

        expect(response.body.message).toBe(UserError.NOT_FOUND);
      });
    });
  });
});
