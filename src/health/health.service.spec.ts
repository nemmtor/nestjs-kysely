import { ServiceUnavailableException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Database } from 'src/database';
import { HealthService } from './health.service';

describe('health service', () => {
  let service: HealthService;
  let databaseMock: DeepMocked<Database>;

  beforeEach(async () => {
    databaseMock = createMock<Database>();

    const moduleRef = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: Database,
          useValue: databaseMock,
        },
      ],
    }).compile();

    service = moduleRef.get(HealthService);
  });

  it('doesnt throw when db is alive', () => {
    expect(service.healthCheck()).resolves;
  });

  it('throws ServiceUnavailableException', async () => {
    databaseMock.executeQuery.mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(service.healthCheck()).rejects.toThrow(
      ServiceUnavailableException,
    );
  });
});
