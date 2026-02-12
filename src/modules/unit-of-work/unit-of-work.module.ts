import { Global, Module } from '@nestjs/common';
import { UOW_PROVIDER } from './tokens';
import { PrismaUnitOfWork } from './providers';

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
