import { Logger, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
  imports: [
    TerminusModule.forRoot({
      logger: Logger,
    }),
  ],
  providers: [Logger],
})
export class HealthModule {}
