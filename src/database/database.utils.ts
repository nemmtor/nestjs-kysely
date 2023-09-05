import * as path from 'node:path';
import { promises as fs } from 'node:fs';

import { FileMigrationProvider, Kysely, Migrator } from 'kysely';

import { Tables } from './database.types';

export const migrateToLatest = async (database: Kysely<Tables>) => {
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
    for (const it of results) {
      if (it.status === 'Success') {
        console.log(
          `migration "${it.migrationName}" was executed successfully`,
        );
      } else if (it.status === 'Error') {
        console.error(`failed to execute migration "${it.migrationName}"`);
      }
    }

  if (error) {
    console.error(error);
    throw new Error('Failed to migrate');
  }

  // await database.destroy();
};
