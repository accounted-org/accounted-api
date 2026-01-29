import { Module } from '@nestjs/common';
import {
  AuthModule,
  PrismaModule,
  TransactionModule,
  UtilsModule,
} from './modules';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    UtilsModule,
    PrismaModule,
    AuthModule,
    TransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
