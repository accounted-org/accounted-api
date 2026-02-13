import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { IEmailQueueService } from './email-queue.service.interface';
import { Queue } from 'bullmq';
import {
  SendForgotPasswordEmailPayload,
  SendChangeEmailRequestEmailPayload,
  SendNotifyEmailChangedEmailPayload,
  SendPasswordChangedEmailPayload,
} from '../@types';
import { EMAIL_QUEUE } from '../tokens';

@Injectable()
export class BullMQMailQueueService
  implements IEmailQueueService, OnModuleDestroy
{
  constructor(
    @Inject(EMAIL_QUEUE)
    private readonly queue: Queue,
  ) {}

  private async enqueueEmail(jobName: string, payload: any): Promise<void> {
    await this.queue.add(jobName, payload, {
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    });
  }

  async onModuleDestroy() {
    await this.queue.close();
  }

  async enqueueForgotPasswordEmail(
    payload: SendForgotPasswordEmailPayload,
  ): Promise<void> {
    await this.enqueueEmail('send-forgot-password-email', payload);
  }

  async enqueueChangeEmailRequestEmail(
    payload: SendChangeEmailRequestEmailPayload,
  ): Promise<void> {
    await this.enqueueEmail('send-change-email-request-email', payload);
  }

  async enqueueNotifyEmailChangedEmail(
    payload: SendNotifyEmailChangedEmailPayload,
  ): Promise<void> {
    await this.enqueueEmail('send-notify-email-changed-email', payload);
  }

  async enqueuePasswordChangedEmail(
    payload: SendPasswordChangedEmailPayload,
  ): Promise<void> {
    await this.enqueueEmail('send-password-changed-email', payload);
  }
}
