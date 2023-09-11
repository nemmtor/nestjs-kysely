import { Controller, Get, Logger, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { KillSwitchService } from './kill-switch.service';
import { KillSwitchParametersDto } from './dto';

@ApiTags('killswitch')
@Controller('killswitch')
export class KillSwitchController {
  constructor(
    private readonly logger: Logger,
    private readonly killSwitchService: KillSwitchService,
  ) {}

  // TODO: add swagger
  // TODO: protect this with some secret
  // TODO: add tests
  @Get(':status')
  setKillSwitch(@Param() parameters: KillSwitchParametersDto) {
    const { status } = parameters;
    this.logger.log(`Killswitch: ${status}`);

    const shouldKill = status === 'on';
    this.killSwitchService.setKillSwitch(shouldKill);
  }
}
