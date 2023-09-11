import { Logger, Module } from '@nestjs/common';

import { KillSwitchService } from './kill-switch.service';
import { KillSwitchController } from './kill-switch.controller';

@Module({
  controllers: [KillSwitchController],
  providers: [KillSwitchService, Logger],
  exports: [KillSwitchService],
})
export class KillSwitchModule {}
