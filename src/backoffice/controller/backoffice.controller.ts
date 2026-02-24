import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class BackofficeController {
  @Get()
  hello() {
    return 'Hello, Backoffice!';
  }
}
