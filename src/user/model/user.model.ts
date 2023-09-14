import { ColumnType, Insertable, Selectable, Updateable } from 'kysely';

export type UserTable = {
  id: ColumnType<string, string, never>;
  email: string;
  password: string;
  createdAt: ColumnType<Date, string | undefined, never>;
  // TODO: add Postgres trigger to auto update timestamp
  updatedAt: ColumnType<Date, string | undefined, string | undefined>;
};

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
