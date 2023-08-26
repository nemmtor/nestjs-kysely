import { Global, Module } from '@nestjs/common';
import { Database } from './database';
import { databaseFactory } from './database.factory';
import {
  ConfigurableDatabaseModule,
  DATABASE_OPTIONS,
} from './database.module-definition';

@Global()
@Module({
  exports: [Database],
  providers: [
    {
      provide: Database,
      inject: [DATABASE_OPTIONS],
      useFactory: databaseFactory,
    },
  ],
})
export class DatabaseModule extends ConfigurableDatabaseModule {}
