import { Kysely, sql } from 'kysely';

const userTableName = 'user';

export async function up(database: Kysely<unknown>): Promise<void> {
  await database.schema
    .createTable(userTableName)
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('email', 'varchar', (col) => col.notNull().unique())
    .addColumn('password', 'varchar', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn('deleted_at', 'timestamp')
    .execute();
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await database.schema.dropTable(userTableName).execute();
}
