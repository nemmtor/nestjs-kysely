import { Module } from '@nestjs/common';

import { UserModule } from 'src/user';
import { ConfigModule } from 'src/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminTokenStrategy } from './strategies';

@Module({
  imports: [UserModule, ConfigModule],
  providers: [AuthService, AdminTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
