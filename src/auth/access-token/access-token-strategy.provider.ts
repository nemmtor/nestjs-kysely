import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserService } from 'src/user';
import { ConfigService } from 'src/config';

import { AccessTokenDto } from './access-token.dto';
import { ACCESS_TOKEN_STRATEGY } from './access-token.constants';

@Injectable()
class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  ACCESS_TOKEN_STRATEGY,
) {
  constructor(
    private readonly userService: UserService,
    secret: string,
  ) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
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

export const AccessTokenStrategyProvider = {
  inject: [UserService, ConfigService],
  provide: AccessTokenStrategy,
  useFactory: (userService: UserService, configService: ConfigService) => {
    return new AccessTokenStrategy(
      userService,
      configService.get('application').accessTokenSecret,
    );
  },
};
