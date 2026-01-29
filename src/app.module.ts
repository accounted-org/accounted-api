import { Module } from '@nestjs/common';
import {
  AuthModule,
  PrismaModule,
  TransactionModule,
  UtilsModule,
} from './modules';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    UtilsModule,
    PrismaModule,
    AuthModule,
    TransactionModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
