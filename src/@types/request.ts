import { Request as ExpressRequest } from 'express';
import { RefreshTokenPayload, TokenPayload } from './token';

export type Request = ExpressRequest & { user: TokenPayload };
export type RefreshRequest = ExpressRequest & {
  user: RefreshTokenPayload;
};
