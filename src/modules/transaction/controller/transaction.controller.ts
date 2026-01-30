import { Controller, Get, Inject, Param } from '@nestjs/common';
import { TRANSACTION_SERVICE } from '../tokens';
import { type ITransactionService } from '../service';

@Controller('transactions')
export class TransactionController {
  constructor(
    @Inject(TRANSACTION_SERVICE)
    private readonly transactionService: ITransactionService,
  ) {}

  @Get(':id')
  async getTransactionById(@Param('id') id: string) {
    return this.transactionService.getTransactionById(id);
  }
}
