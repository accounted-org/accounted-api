import { Inject, Injectable } from '@nestjs/common';
import { type IEmailService } from '../service';
import { EMAIL_SERVICE } from '../tokens';
import { SendForgotPasswordEmailPayload, MailJobStrategy } from '../@types';

@Injectable()
export class SendForgotPasswordStrategy implements MailJobStrategy<SendForgotPasswordEmailPayload> {
  readonly jobName = 'send-forgot-password-email';

  constructor(
    @Inject(EMAIL_SERVICE)
    private readonly emailService: IEmailService,
  ) {}

  async handle(data: SendForgotPasswordEmailPayload) {
    await this.emailService.sendForgotPasswordEmail(data);
  }
}
