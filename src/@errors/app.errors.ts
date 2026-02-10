import { USER_ERRORS } from './user.errors';
import { AUTH_ERRORS } from './auth.errors';
import { EMAIL_ERRORS } from './email.errors';
import { MFA_ERRORS } from './mfa.errors';
import { SYS_ERRORS } from './sys.errors';

export const APP_ERRORS = {
  ...USER_ERRORS,
  ...EMAIL_ERRORS,
  ...SYS_ERRORS,
  ...MFA_ERRORS,
  ...AUTH_ERRORS,
} as const;
