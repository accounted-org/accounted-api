import { Global, Module } from '@nestjs/common';
import { UOW_PROVIDER } from './tokens';
import { PrismaUnitOfWork } from './prisma-unit-of-work';

@Global()
@Module({
  providers: [
    {
      provide: UOW_PROVIDER,
      useClass: PrismaUnitOfWork,
    },
  ],
  exports: [
    {
      provide: UOW_PROVIDER,
      useClass: PrismaUnitOfWork,
    },
  ],
})
export class UnitOfWorkModule {}
