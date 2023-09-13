import { Strategy } from 'passport-http-bearer';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Injectable, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { ConfigService } from 'src/config';

const ADMIN_TOKEN_STRATEGY = 'admin-token-strategy';

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

@Injectable()
class _AdminTokenAuthGuard extends AuthGuard(ADMIN_TOKEN_STRATEGY) {}

export const AdminTokenAuth = () =>
  applyDecorators(
    UseGuards(_AdminTokenAuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
