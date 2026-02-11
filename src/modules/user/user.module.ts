import { Module } from '@nestjs/common';
import { UserController } from './controller';
import { UserService } from './service';
import { PrismaUserPersistenceAdapter } from './repository/prisma-user.persistence-adapter';
import { USER_REPOSITORY, USER_SERVICE } from './tokens';
import { UserBuilder } from './user.builder';
import { PrismaService } from '../prisma';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useFactory: (prisma: PrismaService) => {
        return new PrismaUserPersistenceAdapter(prisma);
      },
      inject: [PrismaService],
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
