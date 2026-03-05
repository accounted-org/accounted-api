import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { PlanController } from './controller';
import { PrismaPlanPersistenceAdapter } from './repository';
import { PlanService } from './service';
import { PLAN_REPOSITORY, PLAN_SERVICE } from './tokens';

@Module({
  controllers: [PlanController],
  providers: [
    {
      provide: PLAN_REPOSITORY,
      useFactory: (prisma: PrismaService) => {
        return new PrismaPlanPersistenceAdapter(prisma);
      },
      inject: [PrismaService],
    },
    {
      provide: PLAN_SERVICE,
      useClass: PlanService,
    },
  ],
})
export class PlanModule {}
