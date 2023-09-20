import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  UnauthorizedException,
  UseGuards,
  applyDecorators,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { UserService } from 'src/user';

import { AccessTokenDto } from '../dto';

const ACCESS_TOKEN_JWT_STRATEGY = 'access-token-jwt-strategy';

export const ACCESS_TOKEN_JWT_SERVICE = 'AccessTokenJwtService';

@Injectable()
export class AccessTokenJwtStrategy extends PassportStrategy(
  Strategy,
  ACCESS_TOKEN_JWT_STRATEGY,
) {
  constructor(
    private readonly userService: UserService,
    jwtSecret: string,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(accessTokenDto: AccessTokenDto): Promise<AccessTokenDto> {
    const user = await this.userService.findById(accessTokenDto.userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    return accessTokenDto;
  }
}

@Injectable()
class AccessTokenJwtAuthGuard extends AuthGuard(ACCESS_TOKEN_JWT_STRATEGY) {}

export const AccessTokenJwtAuth = () =>
  applyDecorators(
    UseGuards(AccessTokenJwtAuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
