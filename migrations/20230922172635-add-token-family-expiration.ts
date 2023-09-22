import { Kysely, sql } from 'kysely';

const tokenFamilyTableName = 'token_family';

export async function up(database: Kysely<unknown>): Promise<void> {
  await database.schema
    .alterTable(tokenFamilyTableName)
    .addColumn('expires_at', 'timestamp', (col) =>
      col.defaultTo(sql`current_date + interval '7 days'`).notNull(),
    )
    .execute();
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await database.schema
    .alterTable(tokenFamilyTableName)
    .dropColumn('expires_at')
    .execute();
}
