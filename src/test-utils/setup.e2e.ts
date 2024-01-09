import { VersioningType } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from 'src/app.module';

export const setupAppForTests = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  return app;
};
