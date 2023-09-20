import { ColumnType, Insertable, Selectable, Updateable } from 'kysely';

export type RefreshTokenTable = {
  token: ColumnType<string, string, never>;
  tokenFamilyId: ColumnType<string, string, never>;
  createdAt: ColumnType<Date, never, never>;
};

export type RefreshToken = Selectable<RefreshTokenTable>;
export type NewRefreshToken = Insertable<RefreshTokenTable>;
export type RefreshTokenUpdate = Updateable<RefreshTokenTable>;
