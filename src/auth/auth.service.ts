import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';

import { UserService } from 'src/user';

import { RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await hash(registerDto.password, 10);

    return this.userService.create({
      email: registerDto.email,
      password: hashedPassword,
    });
  }
}
