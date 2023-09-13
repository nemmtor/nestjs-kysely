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
  // TODO: verify if this works when having more than 1 table
  return sql`truncate table ${sql.table(allTables.join(', '))}`.execute(
    database,
  );
};
