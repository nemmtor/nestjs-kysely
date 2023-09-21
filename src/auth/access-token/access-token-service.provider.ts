import { JwtService } from '@nestjs/jwt';

import { ConfigService } from 'src/config';

import { ACCESS_TOKEN_SERVICE } from './access-token.constants';

export const AccessTokenServiceProvider = {
  inject: [ConfigService],
  provide: ACCESS_TOKEN_SERVICE,
  useFactory: (configService: ConfigService) => {
    return new JwtService({
      secret: configService.get('application').accessTokenSecret,
      signOptions: { expiresIn: '60s' },
    });
  },
};
