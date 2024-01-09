import { FindUserByIdQueryResult } from './find-user-by-id.query-result';

export interface UserQuery {
  findById: (id: string) => Promise<FindUserByIdQueryResult | undefined>;
}
