import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto';
import { UserRepository } from './user.repository';

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
