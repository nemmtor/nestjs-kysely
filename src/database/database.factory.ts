import { PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { Database } from './database';
import { DatabaseConfig } from './database.types';

export const databaseFactory = (databaseConfig: DatabaseConfig) => {
  const dialect = new PostgresDialect({
    pool: new Pool(databaseConfig),
  });

  return new Database({
    dialect,
  });
};
