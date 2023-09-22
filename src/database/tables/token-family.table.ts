import { ColumnType } from 'kysely';

export type TokenFamilyTable = {
  createdAt: ColumnType<Date, never, never>;
  expiresAt: ColumnType<Date, never, never>;
  id: ColumnType<string, string, never>;
  updatedAt: ColumnType<Date, never, never>;
  userId: ColumnType<string, string, never>;
};
