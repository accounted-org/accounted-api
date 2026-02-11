import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
  constructor(
    @InjectMetric('http_requests_total')
    private readonly counter: Counter<string>,
  ) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const req = ctx.switchToHttp().getRequest<Request & { route?: any }>();
    const method = (req as any).method;
    const route = (req as any).route?.path ?? (req as any).url ?? 'unknown';

    return next.handle().pipe(
      tap({
        next: () => {
          const res = ctx.switchToHttp().getResponse<any>();
          this.counter.inc({
            method,
            route,
            status: String(res.statusCode),
          });
        },
        error: () => {
          const res = ctx.switchToHttp().getResponse<any>();
          this.counter.inc({
            method,
            route,
            status: String(res?.statusCode ?? 500),
          });
        },
      }),
    );
  }
}
