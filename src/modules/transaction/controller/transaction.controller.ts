import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { TRANSACTION_SERVICE } from '../tokens';
import { type ITransactionService } from '../service';
import { JwtAuthGuard } from 'modules/auth/guards';

@Controller('transactions')
export class TransactionController {
  constructor(
    @Inject(TRANSACTION_SERVICE)
    private readonly transactionService: ITransactionService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getTransactionById(@Param('id') id: string) {
    return this.transactionService.getTransactionById(id);
  }
}
