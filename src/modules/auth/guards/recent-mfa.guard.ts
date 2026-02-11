import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRE_RECENT_MFA_KEY } from '../decorators';
import { AppError } from '../../../@errors/app-error';
import { APP_ERRORS } from '../../../@errors';

@Injectable()
export class RecentMfaGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const maxAge = this.reflector.getAllAndOverride<number>(
      REQUIRE_RECENT_MFA_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!maxAge) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.mfaAuthenticatedAt) {
      throw new AppError(APP_ERRORS.MFA_REQUIRED);
    }

    const now = Date.now();
    const mfaAge = now - user.mfaAuthenticatedAt * 1000;

    if (mfaAge > maxAge * 1000) {
      throw new AppError(APP_ERRORS.MFA_REQUIRED);
    }

    return true;
  }
}
