import { ExecutionContext } from '@nestjs/common';

export class MockAuthGuard {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    req.user = {
      id: 'test-user-id',
      email: 'test@test.com',
    };
    return true;
  }
}
