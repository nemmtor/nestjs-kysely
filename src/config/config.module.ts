import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { ConfigService } from './config.service';
import { loadEnvironment } from './config.utils';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [loadEnvironment],
      cache: true,
    }),
  ],
  controllers: [],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
