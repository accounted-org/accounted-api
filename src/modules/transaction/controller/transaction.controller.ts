import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
} from '@nestjs/common';
import { TRANSACTION_SERVICE } from '../tokens';
import { type ITransactionService } from '../service';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
  constructor(
    @Inject(TRANSACTION_SERVICE)
    private readonly transactionService: ITransactionService,
  ) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a transaction by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the transaction to retrieve',
    type: String,
  })
  async getTransactionById(@Param('id') id: string) {
    return this.transactionService.getTransactionById(id);
  }
}
