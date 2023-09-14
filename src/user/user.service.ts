import { Injectable } from '@nestjs/common';

import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto);
  }

  findByEmail(email: string) {
    return this.userRepository.findByEmail(email, ['id', 'email', 'password']);
  }

  findById(id: string) {
    return this.userRepository.findById(id, ['id', 'email']);
  }
}
