import { Injectable } from '@nestjs/common';
import { Transaction } from '@types';

import { ITransactionRepository } from './transaction.repository.interface';
import { PrismaService } from 'modules';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getTransactionById(id: string): Promise<Transaction | null> {
    return await this.prismaService.transaction.findUnique({
      where: { id },
    });
  }
}
