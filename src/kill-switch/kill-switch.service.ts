import { Injectable } from '@nestjs/common';

@Injectable()
export class KillSwitchService {
  private isKilled = false;

  setKillSwitch(shouldKill: boolean): void {
    this.isKilled = shouldKill;
  }

  isApplicationRunning(): boolean {
    return !this.isKilled;
  }
}
