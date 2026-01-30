import { Module } from '@nestjs/common';
import { UserController } from './controller';
import { UserService } from './service';
import { UserRepository } from './repository/user.repository';
import { USER_REPOSITORY, USER_SERVICE } from './tokens';
import { UserBuilder } from './user.builder';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: USER_SERVICE,
      useClass: UserService,
    },
    UserBuilder,
  ],
  exports: [
    {
      provide: USER_SERVICE,
      useClass: UserService,
    },
  ],
})
export class UserModule {}
