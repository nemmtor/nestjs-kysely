import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { ConfigService } from './config.service';
import { configSchema } from './config.schema';

const loadEnvironment = () => {
  return configSchema.parse(process.env);
};

@Global()
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
