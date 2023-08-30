import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as winston from 'winston';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import { patchNestJsSwagger } from 'nestjs-zod';

import { AppModule } from './app';
import { ConfigService } from './config';

patchNestJsSwagger();

async function bootstrap() {
  const loggerInstance = winston.createLogger({
    transports: [
      new winston.transports.File({
        filename: 'error.log',
        level: 'error',
        format: winston.format.json(),
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

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(loggerInstance),
  });

  const configService = app.get(ConfigService);
  const port = configService.get('port');

  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  const config = new DocumentBuilder().build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
}

bootstrap();
