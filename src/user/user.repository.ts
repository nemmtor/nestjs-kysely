import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';

import { Database } from '../database';

import { CreateUserDto } from './dto';

@Injectable()
export class UserRepository {
  constructor(private readonly database: Database) {}

  create(createUserDto: CreateUserDto) {
    return this.database
      .insertInto('user')
      .values({
        id: uuidv4(),
        ...createUserDto,
      })
      .returning(['email', 'updatedAt', 'id', 'createdAt'])
      .executeTakeFirst();
  }
}
