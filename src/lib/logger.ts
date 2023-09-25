import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { map, Observable } from 'rxjs';
import fastRedact from 'fast-redact';
import * as winston from 'winston';

const redact = fastRedact({
  paths: ['password', 'accessToken', 'refreshToken'],
  serialize: false,
});

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),

  transports: [
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
    }),
    new winston.transports.Console(),
  ],
});

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<object>,
  ): Observable<object> | Promise<Observable<object>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((data) => {
        const redactedRequestBody = redact({ ...request.body });
        const redactedResponseBody = redact({ ...data });

        this.logger.error(
          {
            // requestId: RequestStorage.getStorage().requestId,
            body: redactedRequestBody,
            method: request.method,
            response: redactedResponseBody,
            status: response.statusCode,
            url: request.url,
            user: request.user,
            userAgent: request.header('user-agent'),
          },
          LoggerInterceptor.name,
        );
        return data;
      }),
    );
  }
}
