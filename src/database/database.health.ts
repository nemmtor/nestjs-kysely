import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { sql } from 'kysely';

import { isObject } from 'src/utils';

import { Database } from './database';

const STATUS_KEY = 'database';

@Injectable()
export class DatabaseHealthIndicator extends HealthIndicator {
  constructor(private readonly database: Database) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    try {
      const query = sql`SELECT 1`.compile(this.database);
      await this.database.executeQuery(query);
      const result = this.getStatus(STATUS_KEY, true);
      return result;
    } catch (error) {
      const result = this.getStatus(
        STATUS_KEY,
        false,
        isObject(error) ? error : undefined,
      );
      throw new HealthCheckError('Database failed failed', result);
    }
  }
}
