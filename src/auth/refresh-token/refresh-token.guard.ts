import { Injectable, UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { REFRESH_TOKEN_STRATEGY } from './refresh-token.constants';
import { RefreshRequestDto } from './refresh-token.dto';

@Injectable()
class RefreshTokenAuthGuard extends AuthGuard(REFRESH_TOKEN_STRATEGY) {}

export const RefreshTokenAuth = () =>
  applyDecorators(
    UseGuards(RefreshTokenAuthGuard),
    ApiBody({ type: RefreshRequestDto }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
