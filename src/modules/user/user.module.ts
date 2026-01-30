import { Module } from '@nestjs/common';
import { UserController } from './controller';
import { UserService } from './service';
import { PrismaUserPersistenceAdapter } from './repository/prisma-user.persistence-adapter';
import { USER_REPOSITORY, USER_SERVICE } from './tokens';
import { UserBuilder } from './user.builder';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserPersistenceAdapter,
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
