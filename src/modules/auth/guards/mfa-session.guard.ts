import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AppError } from '../../../@errors/app-error';
import { APP_ERRORS } from '../../../@errors';
import { Reflector } from '@nestjs/core';
import { SKIP_MFA_SESSION_KEY } from '../decorators';

@Injectable()
export class MfaSessionGuard implements CanActivate {
  // mudar pra env
  private readonly MFA_WINDOW_MS = 24 * 60 * 60 * 1000; // 24h

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const skip = this.reflector.getAllAndOverride<boolean>(
      SKIP_MFA_SESSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (skip) {
      return true;
    }

    if (!user) {
      return false;
    }

    if (!user.mfaAuthenticatedAt) {
      throw new AppError(APP_ERRORS.MFA_REQUIRED);
    }

    const now = Date.now();
    const mfaAge = now - user.mfaAuthenticatedAt * 1000;

    if (mfaAge > this.MFA_WINDOW_MS) {
      throw new AppError(APP_ERRORS.MFA_EXPIRED);
    }

    return true;
  }
}
