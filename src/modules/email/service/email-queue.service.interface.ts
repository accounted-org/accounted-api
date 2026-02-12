import {
  SendChangeEmailRequestEmailPayload,
  SendForgotPasswordEmailPayload,
  SendNotifyEmailChangedEmailPayload,
  SendPasswordChangedEmailPayload,
} from '../@types';

export interface IEmailQueueService {
  enqueueForgotPasswordEmail(
    payload: SendForgotPasswordEmailPayload,
  ): Promise<void>;
  enqueueChangeEmailRequestEmail(
    payload: SendChangeEmailRequestEmailPayload,
  ): Promise<void>;
  enqueueNotifyEmailChangedEmail(
    payload: SendNotifyEmailChangedEmailPayload,
  ): Promise<void>;
  enqueuePasswordChangedEmail(
    payload: SendPasswordChangedEmailPayload,
  ): Promise<void>;
}
