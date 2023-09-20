import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';

import { Database } from 'src/database';

import { CreateUserDto } from '../dto';
import { UserColumn, UserSelectResult } from '../model';

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

  findById<Columns extends UserColumn[]>(
    id: string,
    select: Columns,
  ): Promise<UserSelectResult<Columns> | undefined> {
    return this.database
      .selectFrom('user')
      .select(select)
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }

  findByEmail<Columns extends UserColumn[]>(
    email: string,
    select: Columns,
  ): Promise<UserSelectResult<Columns> | undefined> {
    return this.database
      .selectFrom('user')
      .select(select)
      .where('email', '=', email)
      .executeTakeFirstOrThrow();
  }
}
