import { Logger, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';

@Module({
  imports: [
    TerminusModule.forRoot({
      logger: Logger,
    }),
  ],
  controllers: [HealthController],
  providers: [Logger],
})
export class HealthModule {}
