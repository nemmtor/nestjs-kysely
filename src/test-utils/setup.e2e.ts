import { VersioningType } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from 'src/app';
import { DatabaseExceptionFilter } from 'src/database';

export const setupApp = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  app.useGlobalFilters(new DatabaseExceptionFilter());

  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  return app;
};
