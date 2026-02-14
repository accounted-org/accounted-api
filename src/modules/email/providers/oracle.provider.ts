import { Injectable } from '@nestjs/common';
import { IEmailPayload, IEmailProvider } from './email.provider.interface';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OracleEmailProvider implements IEmailProvider {
  readonly name: string = 'Oracle Email Provider';

  private transporter: nodemailer.Transporter;
  private readonly emailDomain: string;

  constructor(readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: process.env.ORACLE_SMTP_HOST,
      port: Number(process.env.ORACLE_SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.ORACLE_SMTP_USER,
        pass: process.env.ORACLE_SMTP_PASS,
      },
    });
    this.emailDomain = String(configService.get('EMAIL_DOMAIN'));
  }

  async send(payload: IEmailPayload): Promise<string | undefined> {
    const response = await this.transporter.sendMail({
      from: `"Accounted" <no-reply@${this.emailDomain}>`,
      ...payload,
    });

    return response.id;
  }
}
