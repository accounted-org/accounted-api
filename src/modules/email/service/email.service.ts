import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { IEmailService } from './email.service.interface';
import { EMAIL_PROVIDER, EMAIL_TEMPLATE_SERVICE } from '../tokens';
import { type IEmailProvider } from '../providers';
import { type IEmailTemplateService } from './email-template.service.interface';
import { Lang } from '../../../@types';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import {
  SendChangeEmailRequestEmailPayload,
  SendForgotPasswordEmailPayload,
  SendNotifyEmailChangedEmailPayload,
  SendPasswordChangedEmailPayload,
} from '../@types';

@Injectable()
export class EmailService implements IEmailService {
  constructor(
    @Inject(EMAIL_PROVIDER)
    private readonly emailProvider: IEmailProvider,
    @Inject(EMAIL_TEMPLATE_SERVICE)
    private readonly emailTemplateService: IEmailTemplateService,
    @InjectPinoLogger(EmailService.name)
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
  ) {}

  async sendChangeEmailRequestEmail({
    user,
    email,
    link,
    expiresIn,
  }: SendChangeEmailRequestEmailPayload): Promise<boolean> {
    try {
      await this.emailProvider.send({
        to: email,
        // to-do: mover subject para mapper file
        subject: 'Solicitação de alteração de e-mail',
        html: this.emailTemplateService.render(
          'change-email-request.template',
          user?.preferredLanguage ?? Lang.PT_BR,
          {
            name: user.name,
            appName: this.configService.get('APP_NAME'),
            year: new Date().getFullYear(),
            newEmail: email,
            link,
            expiresIn,
          },
        ),
      });
      return true;
    } catch (error) {
      this.logger.error(
        '[sendChangeEmailRequestEmail]: Error sending email: ' + error,
      );
      return false;
    }
  }

  async sendForgotPasswordEmail({
    resetLink,
    user,
  }: SendForgotPasswordEmailPayload): Promise<boolean> {
    try {
      await this.emailProvider.send({
        to: user.email,
        // to-do: mover subject para mapper file
        subject: 'Recuperação de senha',
        html: this.emailTemplateService.render(
          'forgot-password.template',
          user?.preferredLanguage ?? Lang.PT_BR,
          {
            name: user.name,
            resetLink,
          },
        ),
      });
      return true;
    } catch (error) {
      this.logger.error(
        '[sendForgotPasswordEmail]: Error sending email: ' + error,
      );
      return false;
    }
  }

  async sendNotifyEmailChangedEmail({
    user,
    oldEmail,
    newEmail,
  }: SendNotifyEmailChangedEmailPayload): Promise<boolean> {
    try {
      await this.emailProvider.send({
        to: oldEmail,
        // to-do: mover subject para mapper file
        subject: 'Alteração de e-mail - Accounted',
        html: this.emailTemplateService.render(
          'notify-email-changed.template',
          user?.preferredLanguage ?? Lang.PT_BR,
          {
            name: user.name,
            appName: this.configService.get('APP_NAME'),
            year: new Date().getFullYear(),
            newEmail,
            oldEmail,
          },
        ),
      });
      return true;
    } catch (error) {
      this.logger.error(
        '[sendNotifyEmailChangedEmail]: Error sending email: ' + error,
      );
      return false;
    }
  }

  async sendPasswordChangedEmail({
    user,
  }: SendPasswordChangedEmailPayload): Promise<boolean> {
    try {
      await this.emailProvider.send({
        to: user.email,
        // to-do: mover subject para mapper file
        subject: 'Alteração de senha - Accounted',
        html: this.emailTemplateService.render(
          'password-changed.template',
          user?.preferredLanguage ?? Lang.PT_BR,
          {
            name: user.name,
            appName: this.configService.get('APP_NAME'),
            year: new Date().getFullYear(),
            // to-do: atualizar aqu depois de criar o módulo de security-events
            changedAt: new Date().toLocaleDateString(),
            ipAddress: '127.0.0.1',
            userAgent: 'Opera GX',
          },
        ),
      });
      return true;
    } catch (error) {
      this.logger.error(
        '[sendPasswordChangedEmail]: Error sending email: ' + error,
      );
      return false;
    }
  }
}
