import { Module } from '@nestjs/common';
import {
  SPACE_MEMBER_REPOSITORY,
  SPACE_REPOSITORY,
  SPACE_SERVICE,
} from './tokens';
import {
  PrismaSpaceMemberPersistenceAdapter,
  PrismaSpacePersistenceAdapter,
} from './repository';
import { SpaceService } from './service';
import { SpaceController } from './controller';

@Module({
  controllers: [SpaceController],
  providers: [
    {
      provide: SPACE_REPOSITORY,
      useClass: PrismaSpacePersistenceAdapter,
    },
    {
      provide: SPACE_SERVICE,
      useClass: SpaceService,
    },
    {
      provide: SPACE_MEMBER_REPOSITORY,
      useClass: PrismaSpaceMemberPersistenceAdapter,
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
