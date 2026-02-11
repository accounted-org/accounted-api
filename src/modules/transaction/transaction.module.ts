import { Module } from '@nestjs/common';
import { TransactionController } from './controller';
import { TransactionService } from './service';
import { PrimsaTransactionPersistenceAdapter } from './repository';
import { TRANSACTION_REPOSITORY, TRANSACTION_SERVICE } from './tokens';

@Module({
  controllers: [TransactionController],
  providers: [
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: PrimsaTransactionPersistenceAdapter,
    },
    {
      provide: TRANSACTION_SERVICE,
      useClass: TransactionService,
    },
  ],
})
export class TransactionModule {}
