import {
  Injectable,
  NestMiddleware,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { KillSwitchService } from './kill-switch.service';

@Injectable()
export class KillSwitchMiddleware implements NestMiddleware {
  constructor(private readonly killSwitchService: KillSwitchService) {}

  use(_request: Request, _response: Response, next: NextFunction) {
    if (this.killSwitchService.isApplicationRunning()) {
      next();
    } else {
      throw new ServiceUnavailableException(
        'Service is temporarily unavailable.',
      );
    }
  }
}
