import { AuthGuard } from '@nestjs/passport';
import { Injectable, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { ADMIN_TOKEN_STRATEGY } from './admin-token.constants';

@Injectable()
class AdminTokenAuthGuard extends AuthGuard(ADMIN_TOKEN_STRATEGY) {}

export const AdminTokenAuth = () =>
  applyDecorators(
    UseGuards(AdminTokenAuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
