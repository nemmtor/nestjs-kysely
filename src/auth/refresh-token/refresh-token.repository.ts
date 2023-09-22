import { Injectable } from '@nestjs/common';
import { sql } from 'kysely';

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
      .innerJoin('tokenFamily', 'tokenFamily.id', 'refreshToken.tokenFamilyId')
      .select('refreshToken.token')
      .where('refreshToken.tokenFamilyId', '=', tokenFamilyId)
      .where('tokenFamily.expiresAt', '>', sql`now()`)
      .orderBy('refreshToken.createdAt desc')
      .executeTakeFirst();
  }
}
