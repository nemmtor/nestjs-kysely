import {
  ColumnType,
  Insertable,
  Selectable,
  Simplify,
  Updateable,
} from 'kysely';

export type UserTable = {
  id: ColumnType<string, string, never>;
  email: string;
  password: string;
  createdAt: ColumnType<Date, never, never>;
  updatedAt: ColumnType<Date, never, never>;
};

export type UserColumn = keyof UserTable;
export type UserSelectResult<Columns extends UserColumn[]> = Simplify<{
  [key in Columns[number]]: User[key];
}>;

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
