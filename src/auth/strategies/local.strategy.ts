import { Strategy } from 'passport-local';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  UnauthorizedException,
  UseGuards,
  applyDecorators,
} from '@nestjs/common';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';
import { compare } from 'bcrypt';

import { UserService } from 'src/user';

import { RequestUserDto } from '../dto';

const LOCAL_STRATEGY = 'local-strategy';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, LOCAL_STRATEGY) {
  constructor(private readonly userService: UserService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<RequestUserDto> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }

    const isValid = await compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException();
    }

    return { id: user.id, email: user.email };
  }
}

@Injectable()
class LocalAuthGuard extends AuthGuard(LOCAL_STRATEGY) {}

export const LocalAuth = () =>
  applyDecorators(
    UseGuards(LocalAuthGuard),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
