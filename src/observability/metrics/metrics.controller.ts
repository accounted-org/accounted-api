import { Controller, Get, Header } from '@nestjs/common';
import { register } from 'prom-client';
import { Public, SkipMfaSession } from '../../modules/auth';

@Public()
@SkipMfaSession()
@Controller('metrics')
export class MetricsController {
  @Get()
  @Header('Content-Type', register.contentType)
  async metrics() {
    return register.metrics();
  }
}
