import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
  UseGuards,
  applyDecorators,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request } from 'express';

import { UserService } from 'src/user';

import { RefreshTokenDto } from '../dto';
import { AuthService } from '../auth.service';

const REFRESH_TOKEN_JWT_STRATEGY = 'refresh-token-jwt-strategy';

export const REFRESH_TOKEN_JWT_SERVICE = 'RefreshTokenJwtService';

@Injectable()
export class RefreshTokenJwtStrategy extends PassportStrategy(
  Strategy,
  REFRESH_TOKEN_JWT_STRATEGY,
) {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly logger: Logger,
    jwtSecret: string,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
      passReqToCallback: true,
    });
  }
  async validate(
    request: Request,
    refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshTokenDto> {
    const refreshToken = request.body.refreshToken;

    if (typeof refreshToken !== 'string') {
      throw new BadRequestException('Expected valid refresh token');
    }

    const user = await this.userService.findById(refreshTokenDto.userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    if (
      await this.authService.isRefreshTokenCompromised(
        refreshTokenDto,
        refreshToken,
      )
    ) {
      this.logger.error(`Refresh token compromised for user ${user.id}`);
      throw new UnauthorizedException();
    }

    return refreshTokenDto;
  }
}

@Injectable()
class RefreshTokenJwtAuthGuard extends AuthGuard(REFRESH_TOKEN_JWT_STRATEGY) {}

export const RefreshTokenJwtAuth = () =>
  applyDecorators(
    UseGuards(RefreshTokenJwtAuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
