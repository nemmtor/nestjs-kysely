import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { DatabaseHealthIndicator } from 'src/database';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private databaseHealthIndicator: DatabaseHealthIndicator,
  ) {}
  @Get()
  @HealthCheck()
  healthCheck() {
    return this.health.check([() => this.databaseHealthIndicator.isHealthy()]);
  }
}
