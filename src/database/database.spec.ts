import { Test } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { HealthCheckError } from '@nestjs/terminus';

import { DatabaseHealthIndicator } from './database.health';
import { Database } from './database';

describe('database health indicator', () => {
  let service: DatabaseHealthIndicator;
  let databaseMock: DeepMocked<Database>;

  beforeEach(async () => {
    databaseMock = createMock<Database>();

    const moduleRef = await Test.createTestingModule({
      providers: [
        DatabaseHealthIndicator,
        {
          provide: Database,
          useValue: databaseMock,
        },
      ],
    }).compile();

    service = moduleRef.get(DatabaseHealthIndicator);
  });

  it('doesnt throw when db is alive', () => {
    return expect(service.isHealthy()).resolves.toBeDefined();
  });

  it('throws HealthCheckError', async () => {
    databaseMock.executeQuery.mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(service.isHealthy()).rejects.toThrow(HealthCheckError);
  });
});
