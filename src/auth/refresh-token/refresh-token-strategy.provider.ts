import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

import { UserService } from 'src/user';
import { ConfigService } from 'src/config';

import { RefreshTokenDto } from './refresh-token.dto';
import { REFRESH_TOKEN_STRATEGY } from './refresh-token.constants';
import { TokenFamilyRepository } from './token-family.repository';
import { RefreshTokenRepository } from './refresh-token.repository';

@Injectable()
class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  REFRESH_TOKEN_STRATEGY,
) {
  constructor(
    private readonly userService: UserService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly tokenFamilyRepository: TokenFamilyRepository,
    private readonly logger: Logger,
    secret: string,
  ) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      passReqToCallback: true,
      secretOrKey: secret,
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

    const lastTokenByTokenFamilyIdResult =
      await this.refreshTokenRepository.findLastByTokenFamilyId(
        refreshTokenDto.tokenFamilyId,
      );

    if (!lastTokenByTokenFamilyIdResult) {
      throw new UnauthorizedException();
    }

    const isCompromised = lastTokenByTokenFamilyIdResult.token !== refreshToken;

    if (isCompromised) {
      this.logger.error(`Refresh token compromised for user ${user.id}`);
      await this.tokenFamilyRepository.removeById(
        refreshTokenDto.tokenFamilyId,
      );
      throw new UnauthorizedException();
    }

    return refreshTokenDto;
  }
}

export const RefreshTokenStrategyProvider = {
  inject: [
    UserService,
    RefreshTokenRepository,
    TokenFamilyRepository,
    Logger,
    ConfigService,
  ],
  provide: RefreshTokenStrategy,
  useFactory: (
    userService: UserService,
    refreshTokenRepository: RefreshTokenRepository,
    tokenFamilyRepository: TokenFamilyRepository,
    logger: Logger,
    configService: ConfigService,
  ) => {
    return new RefreshTokenStrategy(
      userService,
      refreshTokenRepository,
      tokenFamilyRepository,
      logger,
      configService.get('application').refreshTokenSecret,
    );
  },
};
