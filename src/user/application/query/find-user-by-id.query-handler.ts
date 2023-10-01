import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';

import { UserError } from '../../domain';
import { InjectionToken } from '../injection-token';

import { UserQuery } from './user.query';
import { FindUserByIdQuery } from './find-user-by-id.query';
import { FindUserByIdQueryResult } from './find-user-by-id.query-result';

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdQueryHandler
  implements IQueryHandler<FindUserByIdQuery, FindUserByIdQueryResult>
{
  constructor(
    @Inject(InjectionToken.USER_QUERY) readonly userQuery: UserQuery,
  ) {}

  async execute(query: FindUserByIdQuery) {
    const data = await this.userQuery.findById(query.id);
    if (!data) throw new NotFoundException(UserError.NOT_FOUND);

    return data;
  }
}
