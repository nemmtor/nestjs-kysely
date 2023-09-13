import { INestApplication } from '@nestjs/common';

import { Database, truncateAllTables } from 'src/database';

export const cleanUp = async (app: INestApplication) => {
  const database = app.get(Database);
  await truncateAllTables(database);

  await database.destroy();
  await app.close();
};
