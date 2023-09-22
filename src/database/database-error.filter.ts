import {
  ExceptionFilter,
  Catch,
  ConflictException,
  ArgumentsHost,
  InternalServerErrorException,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { DatabaseError } from 'pg';

const DATABASE_ERROR_TO_HTTP: Record<string, new () => Error> = {
  '23505': ConflictException,
};

const toHttpError = (error: DatabaseError) => {
  const errorConstructor =
    DATABASE_ERROR_TO_HTTP[error.code ?? 'non-existing'] ??
    InternalServerErrorException;

  return new errorConstructor();
};

@Catch(DatabaseError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(error: DatabaseError, host: ArgumentsHost) {
    console.log('error:', error);
    const next = host.switchToHttp().getNext<NextFunction>();
    const httpError = toHttpError(error);
    next(httpError);
  }
}
