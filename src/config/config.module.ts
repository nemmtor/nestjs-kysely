import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { ConfigService } from './config.service';
import { loadEnvironment } from './config.utils';

@Module({
  controllers: [],
  exports: [ConfigService],
  imports: [
    NestConfigModule.forRoot({
      cache: true,
      load: [loadEnvironment],
    }),
  ],
  providers: [ConfigService],
})
export class ConfigModule {}
