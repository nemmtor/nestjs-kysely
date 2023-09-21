import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from 'src/user';
import { ConfigModule } from 'src/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  RefreshTokenRepository,
  RefreshTokenServiceProvider,
  RefreshTokenStrategyProvider,
  TokenFamilyRepository,
} from './refresh-token';
import {
  AccessTokenServiceProvider,
  AccessTokenStrategyProvider,
} from './access-token';
import { AdminTokenStrategy } from './admin-token';
import { LocalStrategy } from './local';

@Module({
  controllers: [AuthController],
  imports: [UserModule, ConfigModule, JwtModule],
  providers: [
    Logger,
    AuthService,
    LocalStrategy,
    AdminTokenStrategy,
    TokenFamilyRepository,
    RefreshTokenRepository,
    AccessTokenServiceProvider,
    AccessTokenStrategyProvider,
    RefreshTokenServiceProvider,
    RefreshTokenStrategyProvider,
  ],
})
export class AuthModule {}
