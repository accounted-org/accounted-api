import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ITransactionService } from './transaction.service.interface';
import { Transaction } from '@types';
import { TRANSACTION_REPOSITORY } from '../tokens';
import { type ITransactionRepository } from '../repository';

@Injectable()
export class TransactionService implements ITransactionService {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async getTransactionById(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.getTransactionById(id);

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
  }
}
