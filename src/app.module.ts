import { Module } from '@nestjs/common';
import {
  PrismaModule,
  UtilsModule,
  AuthModule,
  TransactionModule,
  UserModule,
} from './modules';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import {APP_GUARD} from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth';
import { LogsModule } from './observability/logs.module';
import { MetricsModule } from './observability/metrics/metrics.module';

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
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: `.env`,
    }),
    PrismaModule,
    UtilsModule,
    AuthModule,
    UserModule,
    TransactionModule,
    MetricsModule,
    LogsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
