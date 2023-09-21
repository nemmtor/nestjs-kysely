import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';

import { Database } from 'src/database';

@Injectable()
export class TokenFamilyRepository {
  constructor(private readonly database: Database) {}

  create(userId: string) {
    return this.database
      .insertInto('tokenFamily')
      .values({
        id: uuidv4(),
        userId,
      })
      .returning(['id'])
      .executeTakeFirst();
  }

  removeById(id: string) {
    return this.database
      .deleteFrom('tokenFamily')
      .where('id', '=', id)
      .execute();
  }
}
