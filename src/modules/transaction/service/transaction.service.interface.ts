import { Transaction } from '@types';

export interface ITransactionService {
  getTransactionById(id: string): Promise<Transaction>;
}
