import { sql } from 'kysely';

import { Database } from './database';

const getAllTables = async (database: Database) => {
  const { rows } = await sql<{ tablename: string }>`
    SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema' AND tablename NOT LIKE '%migration%';
  `.execute(database);

  return rows.map((row) => row.tablename);
};

export const truncateAllTables = async (database: Database) => {
  const allTables = await getAllTables(database);
  return Promise.all(
    allTables.map((table) =>
      sql`TRUNCATE TABLE ${sql.table(table)} CASCADE`.execute(database),
    ),
  );
};
