import { Inject, Injectable } from '@nestjs/common';
import { type IEmailService } from '../service';
import { EMAIL_SERVICE } from '../tokens';
import { SendPasswordChangedEmailPayload, MailJobStrategy } from '../@types';

@Injectable()
export class SendPasswordChangedEmailStrategy implements MailJobStrategy<SendPasswordChangedEmailPayload> {
  readonly jobName = 'send-password-changed-email';

  constructor(
    @Inject(EMAIL_SERVICE)
    private readonly emailService: IEmailService,
  ) {}

  async handle(data: SendPasswordChangedEmailPayload) {
    await this.emailService.sendPasswordChangedEmail(data);
  }
}
