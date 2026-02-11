import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { APP_ERRORS } from '../@errors';
import { trace } from '@opentelemetry/api';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(@InjectPinoLogger() private readonly logger: PinoLogger) {}

  catch(exception: unknown, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttp = exception instanceof HttpException;

    const status = isHttp
      ? exception.getStatus()
      : APP_ERRORS.SERVER_ERROR.status;

    const errorResponse = isHttp
      ? exception.getResponse()
      : { error: APP_ERRORS.SERVER_ERROR.code };

    const span = trace.getActiveSpan();
    const traceId = span?.spanContext().traceId;

    this.logger.error({
      error: exception,
      status,
      path: request.url,
      method: request.method,
      traceId,
    });

    response.status(status).json({
      error: errorResponse,
      timestamp: new Date().toISOString(),
    });
  }
}
