import { Injectable, UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { ACCESS_TOKEN_STRATEGY } from './access-token.constants';

@Injectable()
class AccessTokenAuthGuard extends AuthGuard(ACCESS_TOKEN_STRATEGY) {}

export const AccessTokenAuth = () =>
  applyDecorators(
    UseGuards(AccessTokenAuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
