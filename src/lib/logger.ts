import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

export const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: 'error.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),

      level: 'error',
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike('Nest-Kysely', {
          colors: true,
          prettyPrint: true,
        }),
      ),
    }),
  ],
});
