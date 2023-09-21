import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';

import { UserService } from 'src/user';

import { LocalAuthDto } from './local-auth.dto';
import { LOCAL_STRATEGY } from './local.constants';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, LOCAL_STRATEGY) {
  constructor(private readonly userService: UserService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<LocalAuthDto> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isValid = await compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException();
    }

    return { userId: user.id };
  }
}
