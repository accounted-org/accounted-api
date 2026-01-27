import { Module } from '@nestjs/common';
import { TransactionController } from './controller';
import { TransactionService } from './service';
import { TransactionRepository } from './repository';
import { TRANSACTION_REPOSITORY, TRANSACTION_SERVICE } from './tokens';

@Module({
  controllers: [TransactionController],
  providers: [
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: TransactionRepository,
    },
    {
      provide: TRANSACTION_SERVICE,
      useClass: TransactionService,
    },
  ],
})
export class TransactionModule {}
