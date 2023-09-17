import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserModule, UserService } from 'src/user';
import { ConfigModule, ConfigService } from 'src/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminTokenStrategy, LocalStrategy, JwtStrategy } from './strategies';

@Module({
  imports: [
    UserModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('application').jwtSecret,
        signOptions: { expiresIn: '60s' },
      }),
    }),
  ],
  providers: [
    AuthService,
    AdminTokenStrategy,
    LocalStrategy,
    {
      provide: JwtStrategy,
      inject: [UserService, ConfigService],
      useFactory: (userService: UserService, configService: ConfigService) => {
        return new JwtStrategy(
          userService,
          configService.get('application').jwtSecret,
        );
      },
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
