import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { sql } from 'kysely';
import { Database } from 'src/database';

@Injectable()
export class HealthService {
  constructor(private readonly database: Database) {}

  async healthCheck() {
    try {
      const query = sql``.compile(this.database);
      await this.database.executeQuery(query);
    } catch (_error) {
      throw new ServiceUnavailableException({
        database: 'unhealthy',
      });
    }
  }
}
