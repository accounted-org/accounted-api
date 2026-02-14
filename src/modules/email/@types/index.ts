import { User } from '../../../@types';

export interface SendForgotPasswordEmailPayload {
  user: User;
  resetLink: string;
}

export interface SendChangeEmailRequestEmailPayload {
  user: User;
  email: string;
  link: string;
  expiresIn: string;
}

export interface SendNotifyEmailChangedEmailPayload {
  user: User;
  oldEmail: string;
  newEmail: string;
}

export interface SendPasswordChangedEmailPayload {
  user: User;
}

export interface MailJobStrategy<T> {
  readonly jobName: string;
  handle(data: T): Promise<void>;
}

export type MailJobStrategyList =
  | SendForgotPasswordEmailPayload
  | SendChangeEmailRequestEmailPayload
  | SendNotifyEmailChangedEmailPayload
  | SendPasswordChangedEmailPayload;
