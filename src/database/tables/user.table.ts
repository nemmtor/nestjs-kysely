import { ColumnType } from 'kysely';

export type UserTable = {
  createdAt: ColumnType<Date, never, never>;
  email: string;
  id: ColumnType<string, string, never>;
  password: string;
  updatedAt: ColumnType<Date, never, never>;
};
