import { HttpException, Logger, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { SentryInterceptor, SentryModule } from '@travelerdev/nestjs-sentry';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ZodValidationPipe } from 'nestjs-zod';

import { ConfigModule, ConfigService } from 'src/config';
import { DatabaseModule } from 'src/database';
import { HealthModule } from 'src/health';

@Module({
  imports: [
    HealthModule,
    DatabaseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseConfig = configService.get('database');
        return {
          host: databaseConfig.host,
          port: databaseConfig.port,
          database: databaseConfig.name,
          user: databaseConfig.user,
          password: databaseConfig.password,
        };
      },
    }),
    ThrottlerModule.forRoot({
      ttl: 30,
      limit: 10,
    }),
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (cfg: ConfigService) => {
        const environment = cfg.get('application').environment;
        return {
          dsn: cfg.get('sentry').dsn,
          debug: environment === 'local',
          environment,
          enabled: !['ci', 'test'].includes(environment),
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [],
  providers: [
    Logger,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useFactory: () =>
        new SentryInterceptor({
          filters: [
            {
              type: HttpException,
              filter: (exception: HttpException) => 500 > exception.getStatus(),
            },
          ],
        }),
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
