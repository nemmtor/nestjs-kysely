import { ColumnType, Insertable, Selectable, Updateable } from 'kysely';

export type UserTable = {
  id: ColumnType<string, string, never>;
  email: string;
  password: string;
  createdAt: ColumnType<Date, never, never>;
  updatedAt: ColumnType<Date, never, never>;
};

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
