import { IQueryResult } from '@nestjs/cqrs';

export class FindUserByIdQueryResult implements IQueryResult {
  readonly id: string;
  readonly email: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | undefined;
}
