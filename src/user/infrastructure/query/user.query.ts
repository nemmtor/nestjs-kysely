import { Injectable } from '@nestjs/common';

import { Database } from 'src/lib';

import { FindUserByIdQueryResult, UserQuery } from '../../application';

@Injectable()
export class UserQueryImplement implements UserQuery {
  constructor(private readonly readDatabase: Database) {}
  async findById(id: string): Promise<FindUserByIdQueryResult | undefined> {
    const user = await this.readDatabase
      .selectFrom('user')
      .select([
        'user.id',
        'user.email',
        'user.createdAt',
        'user.updatedAt',
        'user.deletedAt',
      ])
      .where('user.id', '=', id)
      .executeTakeFirst();

    return user
      ? {
          createdAt: user.createdAt,
          deletedAt: user.deletedAt,
          email: user.email,
          id: user.id,
          updatedAt: user.updatedAt,
        }
      : undefined;
  }
}
