import { ColumnType, Selectable } from 'kysely';

export type UserTable = {
  createdAt: ColumnType<Date, never, never>;
  deletedAt: ColumnType<Date, string, never>;
  email: string;
  id: ColumnType<string, string, never>;
  password: string;
  updatedAt: ColumnType<Date, string, never>;
};

export type UserEntity = Selectable<UserTable>;
