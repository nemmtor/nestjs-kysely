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

@Module({
  imports: [
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
          host: databaseConfig.host,
          port: databaseConfig.port,
          database: databaseConfig.name,
          user: databaseConfig.user,
          password: databaseConfig.password,
        };
      },
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ limit: 10, ttl: 30 }],
    }),
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const environment = configService.get('application').environment;
        return {
          dsn: configService.get('sentry').dsn,
          debug: environment === 'local',
          environment,
          enabled: !['ci', 'test'].includes(environment),
        };
      },
      inject: [ConfigService],
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
              type: HttpException,
              filter: (exception) =>
                exception instanceof HttpException
                  ? 500 > exception.getStatus()
                  : true,
            },
          ],
        }),
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
