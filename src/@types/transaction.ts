export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
}

export type Transaction = {
  id: string;
  amount: number;
  description: string | null;
  date: Date;
  source: string | null;
  category: string | null;
  type: string;
  createdAt: Date;
  updatedAt: Date;
};
