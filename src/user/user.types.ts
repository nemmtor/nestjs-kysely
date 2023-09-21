import { Selectable, Simplify } from 'kysely';

import { UserTable } from 'src/database';

export type SelectableUser = Selectable<UserTable>;
export type UserSelect = keyof SelectableUser;
export type UserSelectResult<Columns extends UserSelect[]> = Simplify<{
  [key in Columns[number]]: SelectableUser[key];
}>;
