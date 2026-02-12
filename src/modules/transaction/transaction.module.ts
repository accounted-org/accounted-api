import { Module } from '@nestjs/common';
import { TransactionController } from './controller';
import { TransactionService } from './service';
import { PrimsaTransactionPersistenceAdapter } from './repository';
import { TRANSACTION_REPOSITORY, TRANSACTION_SERVICE } from './tokens';
import { PrismaService } from '../prisma';

@Module({
  controllers: [TransactionController],
  providers: [
    {
      provide: TRANSACTION_REPOSITORY,
      useFactory: (prisma: PrismaService) => {
        return new PrimsaTransactionPersistenceAdapter(prisma);
      },
      inject: [PrismaService],
    },
    {
      provide: TRANSACTION_SERVICE,
      useClass: TransactionService,
    },
  ],
})
export class TransactionModule {}
