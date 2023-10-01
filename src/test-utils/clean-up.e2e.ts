import { INestApplication } from '@nestjs/common';

import { Database } from 'src/lib';

import { truncateAllTables } from './truncate-all-tables';

export const cleanUpAfterTests = async (app: INestApplication) => {
  const database = app.get(Database);
  await truncateAllTables(database);

  await database.destroy();
  await app.close();
};
