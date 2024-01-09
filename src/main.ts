import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { patchNestJsSwagger } from 'nestjs-zod';
import helmet from 'helmet';

import { ConfigService, logger } from './lib';
import { AppModule } from './app.module';

patchNestJsSwagger();

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: WinstonModule.createLogger(logger),
  });

  app.use(helmet());

  const configService = app.get(ConfigService);

  const port = configService.get('application').port;
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  const config = new DocumentBuilder().addBearerAuth().build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
};

bootstrap();
