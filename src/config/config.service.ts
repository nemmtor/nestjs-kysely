import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { Config } from './config.types';

@Injectable()
export class ConfigService extends NestConfigService<Config, true> {
  get<K extends keyof Config>(propertyPath: K): Config[K] {
    return super.get(propertyPath, { infer: true });
  }
}
