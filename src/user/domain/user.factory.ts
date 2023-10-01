import { User, UserImplement } from './user';

type CreateUserProperties = Readonly<{
  email: string;
  id: string;
  name: string;
  password: string;
}>;

export class UserFactory {
  create(properties: CreateUserProperties): User {
    return new UserImplement({
      ...properties,
      createdAt: new Date(),
      deletedAt: undefined,
      updatedAt: new Date(),
    });
  }
}
