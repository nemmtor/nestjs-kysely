import { JwtService } from '@nestjs/jwt';

import { ConfigService } from 'src/config';

import { REFRESH_TOKEN_SERVICE } from './refresh-token.constants';

export const RefreshTokenServiceProvider = {
  inject: [ConfigService],
  provide: REFRESH_TOKEN_SERVICE,
  useFactory: (configService: ConfigService) => {
    return new JwtService({
      secret: configService.get('application').refreshTokenSecret,
      signOptions: { expiresIn: '3d' },
    });
  },
};
