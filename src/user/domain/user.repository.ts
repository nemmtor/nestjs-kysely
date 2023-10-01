import { User } from './user';

export type UserRepository = {
  findById: (id: string) => Promise<User | null>;
};
