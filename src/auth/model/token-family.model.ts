import { ColumnType, Insertable, Selectable, Updateable } from 'kysely';

export type TokenFamilyTable = {
  id: ColumnType<string, string, never>;
  userId: ColumnType<string, string, never>;
  createdAt: ColumnType<Date, never, never>;
  updatedAt: ColumnType<Date, never, never>;
};

export type TokenFamily = Selectable<TokenFamilyTable>;
export type NewTokenFamily = Insertable<TokenFamilyTable>;
export type TokenFamilyUpdate = Updateable<TokenFamilyTable>;
