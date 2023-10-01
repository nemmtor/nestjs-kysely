import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';

import { FindUserByIdQuery } from '../../application';

import { ResponseDescription } from './user.response-description';
import { FindUserByIdRequestParameters, FindUserByIdResponseDto } from './dto';

@ApiTags('users')
@Controller()
export class UserHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiOkResponse({
    description: ResponseDescription.OK,
    type: FindUserByIdResponseDto,
  })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiNotFoundResponse({ description: ResponseDescription.NOT_FOUND })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  @Get('users/:userId')
  async findUserById(@Param() parameters: FindUserByIdRequestParameters) {
    return this.queryBus.execute(new FindUserByIdQuery(parameters.userId));
  }
}
