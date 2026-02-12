import { Injectable } from '@nestjs/common';
import { Transaction } from '../../../@types';

import { ITransactionRepository } from './transaction.repository.interface';
import { PrismaService } from '../../prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrimsaTransactionPersistenceAdapter implements ITransactionRepository {
  constructor(
    private readonly prismaService: PrismaService | Prisma.TransactionClient,
  ) {}

  async getTransactionById(id: string): Promise<Transaction | null> {
    return await this.prismaService.transaction.findUnique({
      where: { id },
    });
  }
}
