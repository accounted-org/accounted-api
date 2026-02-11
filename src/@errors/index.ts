import { APP_ERRORS } from './app.errors';

export type ErrorEntry = (typeof APP_ERRORS)[keyof typeof APP_ERRORS];

export * from './app.errors';
export * from './auth.errors';
export * from './email.errors';
export * from './mfa.errors';
export * from './sys.errors';
export * from './user.errors';
