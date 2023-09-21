import { Injectable } from '@nestjs/common';

import { Database } from 'src/database';

@Injectable()
export class RefreshTokenRepository {
  constructor(private readonly database: Database) {}

  create(token: string, tokenFamilyId: string) {
    return this.database
      .insertInto('refreshToken')
      .values({
        token,
        tokenFamilyId,
      })
      .execute();
  }

  findLastByTokenFamilyId(tokenFamilyId: string) {
    return this.database
      .selectFrom('refreshToken')
      .select('token')
      .where('tokenFamilyId', '=', tokenFamilyId)
      .orderBy('createdAt desc')
      .executeTakeFirst();
  }
}
