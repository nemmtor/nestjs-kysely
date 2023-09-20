import { Logger, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { UserModule, UserService } from 'src/user';
import { ConfigModule, ConfigService } from 'src/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  ACCESS_TOKEN_JWT_SERVICE,
  AccessTokenJwtStrategy,
  AdminTokenStrategy,
  LocalStrategy,
  REFRESH_TOKEN_JWT_SERVICE,
  RefreshTokenJwtStrategy,
} from './strategy';
import { RefreshTokenRepository, TokenFamilyRepository } from './repository';

@Module({
  imports: [UserModule, ConfigModule, JwtModule],
  providers: [
    {
      provide: REFRESH_TOKEN_JWT_SERVICE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new JwtService({
          secret: configService.get('application').refreshTokenJwtSecret,
          signOptions: { expiresIn: '3d' },
        });
      },
    },
    {
      provide: ACCESS_TOKEN_JWT_SERVICE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new JwtService({
          secret: configService.get('application').accessTokenJwtSecret,
          signOptions: { expiresIn: '60s' },
        });
      },
    },
    TokenFamilyRepository,
    RefreshTokenRepository,
    AuthService,
    AdminTokenStrategy,
    LocalStrategy,
    {
      provide: RefreshTokenJwtStrategy,
      inject: [UserService, AuthService, Logger, ConfigService],
      useFactory: (
        userService: UserService,
        authService: AuthService,
        logger: Logger,
        configService: ConfigService,
      ) => {
        return new RefreshTokenJwtStrategy(
          userService,
          authService,
          logger,
          configService.get('application').refreshTokenJwtSecret,
        );
      },
    },
    {
      provide: AccessTokenJwtStrategy,
      inject: [UserService, ConfigService],
      useFactory: (userService: UserService, configService: ConfigService) => {
        return new AccessTokenJwtStrategy(
          userService,
          configService.get('application').accessTokenJwtSecret,
        );
      },
    },
    Logger,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
