import { Logger, Module } from '@nestjs/common';

import { KillSwitchService } from './kill-switch.service';
import { KillSwitchController } from './kill-switch.controller';

@Module({
  controllers: [KillSwitchController],
  exports: [KillSwitchService],
  providers: [KillSwitchService, Logger],
})
export class KillSwitchModule {}
