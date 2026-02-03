import { AUTH_ERRORS } from './auth.errors';

export const APP_ERRORS = {
  SERVER_ERROR: { code: 'SYS_001', status: 500 },
  ...AUTH_ERRORS,
} as const;
