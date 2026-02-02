import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL || 'trace',

        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                  sync: true,
                  colorizeObjects: true,
                  colorize: true,
                  translateTime: 'SYS:dd/mm/yyyy HH:MM:ss',
                  errorLikeObjectKeys: ['err', 'error'],
                },
              }
            : undefined,

        genReqId: (req, res) => {
          const id = (req.headers['x-request-id'] as string) ?? randomUUID();
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
  ],
  exports: [LoggerModule],
})
export class LogsModule {}
