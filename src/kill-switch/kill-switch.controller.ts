import { Controller, Get, Logger, Param } from '@nestjs/common';
import { ApiBadRequestResponse, ApiTags } from '@nestjs/swagger';

import { AdminTokenAuth } from 'src/auth';

import { KillSwitchService } from './kill-switch.service';
import { KillSwitchParametersDto } from './dto';

@ApiTags('killswitch')
@Controller('killswitch')
export class KillSwitchController {
  constructor(
    private readonly logger: Logger,
    private readonly killSwitchService: KillSwitchService,
  ) {}

  @ApiBadRequestResponse({ description: 'Validation failed' })
  @AdminTokenAuth()
  @Get(':status')
  setKillSwitch(@Param() parameters: KillSwitchParametersDto) {
    const { status } = parameters;
    this.logger.log(`Killswitch: ${status}`);

    const shouldKill = status === 'on';
    this.killSwitchService.setKillSwitch(shouldKill);
  }
}
