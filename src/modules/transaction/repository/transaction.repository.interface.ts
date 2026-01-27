import { Transaction } from '@types';

export interface ITransactionRepository {
  getTransactionById(id: string): Promise<Transaction | null>;
}
