import { Inject, Injectable } from '@nestjs/common';
import { type IEmailService } from '../service';
import { EMAIL_SERVICE } from '../tokens';
import { SendChangeEmailRequestEmailPayload, MailJobStrategy } from '../@types';

@Injectable()
export class SendChangeEmailRequestEmailStrategy implements MailJobStrategy<SendChangeEmailRequestEmailPayload> {
  readonly jobName = 'send-change-email-request-email';

  constructor(
    @Inject(EMAIL_SERVICE)
    private readonly emailService: IEmailService,
  ) {}

  async handle(data: SendChangeEmailRequestEmailPayload) {
    await this.emailService.sendChangeEmailRequestEmail(data);
  }
}
