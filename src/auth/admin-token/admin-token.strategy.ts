import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { ConfigService } from 'src/config';

import { ADMIN_TOKEN_STRATEGY } from './admin-token.constants';

@Injectable()
export class AdminTokenStrategy extends PassportStrategy(
  Strategy,
  ADMIN_TOKEN_STRATEGY,
) {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  async validate(token: string) {
    return this.configService.get('application').adminToken === token;
  }
}
