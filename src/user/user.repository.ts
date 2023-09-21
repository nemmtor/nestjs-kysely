import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';

import { Database } from 'src/database';

import { CreateUserDto } from './dto';
import { UserSelect, UserSelectResult } from './user.types';

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

  findById<Columns extends UserSelect[]>(
    id: string,
    select: Columns,
  ): Promise<UserSelectResult<Columns> | undefined> {
    return this.database
      .selectFrom('user')
      .select(select)
      .where('id', '=', id)
      .executeTakeFirst();
  }

  findByEmail<Columns extends UserSelect[]>(
    email: string,
    select: Columns,
  ): Promise<UserSelectResult<Columns> | undefined> {
    return this.database
      .selectFrom('user')
      .select(select)
      .where('email', '=', email)
      .executeTakeFirst();
  }
}
