import { Kysely } from 'kysely';

import { UserTable } from 'src/user/infrastructure/entity/user.entity';

export class Database extends Kysely<{
  user: UserTable;
}> {}
