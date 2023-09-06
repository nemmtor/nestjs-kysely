import * as path from 'node:path';
import { promises as fs } from 'node:fs';

import {
  FileMigrationProvider,
  Kysely,
  Migrator,
  PostgresDialect,
} from 'kysely';
import { config } from 'dotenv';
import { Pool } from 'pg';

config();

export const migrateToLatest = async () => {
  const database = new Kysely({
    dialect: new PostgresDialect({
      pool: new Pool({
        host: process.env['DB_HOST'],
        port: Number(process.env['DB_PORT']),
        database: process.env['DB_NAME'],
        user: process.env['DB_USER'],
        password: process.env['DB_PASSWORD'],
      }),
    }),
  });

  const migrator = new Migrator({
    db: database,
    provider: new FileMigrationProvider({
      fs,
      path,
      // eslint-disable-next-line unicorn/prefer-module
      migrationFolder: path.join(__dirname, './migrations'),
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  if (results)
    for (const result of results) {
      if (result.status === 'Success') {
        console.log(
          `migration "${result.migrationName}" was executed successfully`,
        );
      } else if (result.status === 'Error') {
        console.error(`failed to execute migration "${result.migrationName}"`);
        throw new Error('Failed to migrate');
      }
    }

  if (error) {
    console.error(error);
    throw new Error('Failed to migrate');
  }

  await database.destroy();
};

try {
  migrateToLatest();
} catch {
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1);
}
