import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse } from '@nestjs/swagger';

export const ApiValidationFailedResponse = () =>
  applyDecorators(ApiBadRequestResponse({ description: 'Validation failed' }));
