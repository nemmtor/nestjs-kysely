import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { ConfigService } from './config.service';
import { loadEnv } from './config.utils';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [loadEnv],
      cache: true,
    }),
  ],
  controllers: [],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
