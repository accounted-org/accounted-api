import { APP_ERRORS } from './app.errors';

export type ErrorEntry = (typeof APP_ERRORS)[keyof typeof APP_ERRORS];
export * from './auth.errors';
export * from './app.errors';
