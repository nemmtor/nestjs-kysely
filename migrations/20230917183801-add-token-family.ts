import { Kysely, sql } from 'kysely';

const refreshTokenTableName = 'refresh_token';
const tokenFamilyTableName = 'token_family';

export async function up(database: Kysely<unknown>): Promise<void> {
  await database.schema
    .createTable(tokenFamilyTableName)
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('user_id', 'uuid', (col) =>
      col.references('user.id').onDelete('cascade').notNull(),
    )
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  await database.schema
    .createTable(refreshTokenTableName)
    .addColumn('token', 'varchar', (col) => col.primaryKey())
    .addColumn('token_family_id', 'uuid', (col) =>
      col.references('token_family.id').onDelete('cascade').notNull(),
    )
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  await sql`
    CREATE TRIGGER update_token_family_updated_at BEFORE UPDATE ON public."token_family" FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  `.execute(database);
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await database.schema.dropTable(refreshTokenTableName).execute();

  await database.schema.dropTable(tokenFamilyTableName).execute();

  await sql`
    DROP TRIGGER IF EXISTS update_token_family_updated_at ON public."token_family";
  `.execute(database);
}
