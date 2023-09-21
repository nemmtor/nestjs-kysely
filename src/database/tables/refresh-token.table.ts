import { ColumnType } from 'kysely';

export type RefreshTokenTable = {
  createdAt: ColumnType<Date, never, never>;
  token: ColumnType<string, string, never>;
  tokenFamilyId: ColumnType<string, string, never>;
};
