import { Inject, Injectable } from '@nestjs/common';
import { type IEmailService } from '../service';
import { EMAIL_SERVICE } from '../tokens';
import { SendNotifyEmailChangedEmailPayload, MailJobStrategy } from '../@types';

@Injectable()
export class SendNotifyEmailChangedStrategy implements MailJobStrategy<SendNotifyEmailChangedEmailPayload> {
  readonly jobName = 'send-notify-email-changed-email';

  constructor(
    @Inject(EMAIL_SERVICE)
    private readonly emailService: IEmailService,
  ) {}

  async handle(data: SendNotifyEmailChangedEmailPayload) {
    await this.emailService.sendNotifyEmailChangedEmail(data);
  }
}
