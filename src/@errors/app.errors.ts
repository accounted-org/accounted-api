import { USER_ERRORS } from './user.errors';
import { AUTH_ERRORS } from './auth.errors';
import { EMAIL_ERRORS } from './email.errors';
import { MFA_ERRORS } from './mfa.errors';
import { SYS_ERRORS } from './sys.errors';
import { VALIDATION_ERRORS } from './validation.errors';
import { SPACE_ERRORS } from './space.errors';
import { PLAN_ERRORS } from './plan.errors';

export const APP_ERRORS = {
  ...USER_ERRORS,
  ...EMAIL_ERRORS,
  ...SYS_ERRORS,
  ...MFA_ERRORS,
  ...AUTH_ERRORS,
  ...VALIDATION_ERRORS,
  ...SPACE_ERRORS,
  ...PLAN_ERRORS,
} as const;
