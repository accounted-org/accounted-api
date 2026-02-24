import { Module } from '@nestjs/common';
import { BackofficeController } from './controller';

@Module({
  controllers: [BackofficeController],
})
export class BackofficeModule {}
