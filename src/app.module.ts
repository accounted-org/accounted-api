import { Module } from '@nestjs/common';
import {
  PrismaModule,
  UtilsModule,
  AuthModule,
  TransactionModule,
  UserModule,
  UnitOfWorkModule,
} from './modules';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard, MfaSessionGuard } from './modules/auth';
import { LogsModule } from './observability/logs.module';
import { MetricsModule } from './observability/metrics/metrics.module';
import { EmailModule } from './modules/email';
import { RecentMfaGuard } from './modules/auth/guards/recent-mfa.guard';

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
    EmailModule,
    PrismaModule,
    UtilsModule,
    AuthModule,
    UserModule,
    TransactionModule,
    UnitOfWorkModule,
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
    {
      provide: APP_GUARD,
      useClass: MfaSessionGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RecentMfaGuard,
    },
  ],
})
export class AppModule {}
