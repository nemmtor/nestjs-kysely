import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { FindUserByIdQueryHandler, InjectionToken } from './application';
import { UserQueryImplement } from './infrastructure';
import { UserFactory } from './domain';
import { UserHttpController } from './interface';

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.USER_QUERY,
    useClass: UserQueryImplement,
  },
];
const application: Provider[] = [FindUserByIdQueryHandler];
const domain: Provider[] = [UserFactory];

@Module({
  controllers: [UserHttpController],
  imports: [CqrsModule],
  providers: [...infrastructure, ...application, ...domain],
})
export class UserModule {}
