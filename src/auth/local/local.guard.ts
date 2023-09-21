import { Injectable, UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { LOCAL_STRATEGY } from './local.constants';
import { LocalAuthRequestDto } from './local-auth.dto';

@Injectable()
class LocalAuthGuard extends AuthGuard(LOCAL_STRATEGY) {}

export const LocalAuth = () =>
  applyDecorators(
    UseGuards(LocalAuthGuard),
    ApiBody({ type: LocalAuthRequestDto }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
