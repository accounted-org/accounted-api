import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import { Interfaces } from 'mailgun.js/definitions';

import { IEmailPayload, IEmailProvider } from './email.provider.interface';

@Injectable()
export class MailgunEmailProvider implements IEmailProvider {
  private readonly mg: Interfaces.IMailgunClient;
  private readonly emailDomain: string;

  constructor(readonly configService: ConfigService) {
    const mailgun = new Mailgun(FormData);
    this.mg = mailgun.client({
      username: 'api',
      key: String(configService.get('MAILGUN_API_KEY')),
    });
    this.emailDomain = String(configService.get('EMAIL_DOMAIN'));
  }

  async send(payload: IEmailPayload): Promise<string | undefined> {
    const response = await this.mg.messages.create(this.emailDomain, {
      from: `No-Reply <no-reply@${this.emailDomain}>`,
      ...payload,
    });

    return response.id;
  }
}
