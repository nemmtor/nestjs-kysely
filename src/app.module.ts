import { ScheduleModule } from '@nestjs/schedule';
import {
  HttpException,
  Logger,
  MiddlewareConsumer,
  Module,
} from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { SentryInterceptor, SentryModule } from '@travelerdev/nestjs-sentry';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';

import { ConfigModule, ConfigService } from 'src/config';
import { DatabaseModule } from 'src/database';
import { HealthModule } from 'src/health';
import { UserModule } from 'src/user';
import { AuthModule } from 'src/auth';
import { KillSwitchMiddleware, KillSwitchModule } from 'src/kill-switch';

import { LoggerInterceptor } from './lib';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    KillSwitchModule,
    AuthModule,
    UserModule,
    HealthModule,
    DatabaseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseConfig = configService.get('database');
        return {
          database: databaseConfig.name,
          host: databaseConfig.host,
          password: databaseConfig.password,
          port: databaseConfig.port,
          user: databaseConfig.user,
        };
      },
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ limit: 10, ttl: 30 }],
    }),
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const environment = configService.get('application').environment;
        return {
          debug: environment === 'local',
          dsn: configService.get('sentry').dsn,
          enabled: !['ci', 'test'].includes(environment),
          environment,
        };
      },
    }),
    ConfigModule,
  ],
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
              filter: (exception) =>
                exception instanceof HttpException
                  ? 500 > exception.getStatus()
                  : true,
              type: HttpException,
            },
          ],
        }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(KillSwitchMiddleware)
      .exclude(':version/killswitch/:status')
      .forRoutes('*');
  }
}
