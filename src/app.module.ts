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
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL || 'info',

        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: { singleLine: true, colorize: true },
              }
            : undefined,

        genReqId: (req, res) => {
          const id =
            (req.headers['x-request-id'] as string) ?? crypto.randomUUID();
          res.setHeader('x-request-id', id);
          return id;
        },

        redact: {
          paths: [
            'req.headers.authorization',
            'req.headers.token',
            'req.headers.cookie',
            'req.body.password',
          ],
          censor: '[REDACTED]',
        },

        serializers: {
          req(req) {
            return {
              id: req.id,
              method: req.method,
              url: req.url,
              ip: req.ip,
              userAgent: req.headers?.['user-agent'],
            };
          },
          res(res) {
            return { statusCode: res.statusCode };
          },
        },
      },
    }),
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
