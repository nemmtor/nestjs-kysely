import { AggregateRoot } from '@nestjs/cqrs';

export type UserProperties = Readonly<{
  createdAt: Date;
  deletedAt: Date | undefined;
  email: string;
  id: string;
  password: string;
  updatedAt: Date;
}>;

export type User = {
  compareId: (id: string) => boolean;
};

export class UserImplement extends AggregateRoot implements User {
  private readonly id: string;
  private readonly accountId: string;
  private readonly to: string;
  private readonly subject: string;
  private readonly content: string;
  private readonly createdAt: Date;
  private readonly deletedAt: Date | undefined;

  constructor(properties: UserProperties) {
    super();
    Object.assign(this, properties);
  }

  compareId(id: string) {
    return id === this.id;
  }
}
