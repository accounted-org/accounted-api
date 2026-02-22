import { Module } from '@nestjs/common';
import {
  SPACE_MEMBER_REPOSITORY,
  SPACE_MEMBER_SERVICE,
  SPACE_REPOSITORY,
  SPACE_SERVICE,
} from './tokens';
import {
  PrismaSpaceMemberPersistenceAdapter,
  PrismaSpacePersistenceAdapter,
} from './repository';
import { SpaceMemberService, SpaceService } from './service';
import { SpaceController, SpaceMemberController } from './controller';
import { PrismaService } from '../prisma';
import { UserModule } from '../user';

@Module({
  imports: [UserModule],
  controllers: [SpaceController, SpaceMemberController],
  providers: [
    {
      provide: SPACE_MEMBER_REPOSITORY,
      useFactory: (prisma: PrismaService) => {
        return new PrismaSpaceMemberPersistenceAdapter(prisma);
      },
      inject: [PrismaService],
    },
    {
      provide: SPACE_REPOSITORY,
      useFactory: (prisma: PrismaService) => {
        return new PrismaSpacePersistenceAdapter(prisma);
      },
      inject: [PrismaService],
    },
    {
      provide: SPACE_SERVICE,
      useClass: SpaceService,
    },
    {
      provide: SPACE_MEMBER_SERVICE,
      useClass: SpaceMemberService,
    },
  ],
  exports: [
    {
      provide: SPACE_REPOSITORY,
      useClass: PrismaSpacePersistenceAdapter,
    },
  ],
})
export class SpaceModule {}
