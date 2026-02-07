import { Inject, Injectable } from '@nestjs/common';
import { IEmailService } from './email.service.interface';
import { EMAIL_PROVIDER, EMAIL_TEMPLATE_SERVICE } from '../tokens';
import { type IEmailProvider } from '../providers';
import { type IEmailTemplateService } from './email-template.service.interface';
import { Lang, User } from '../../../@types';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class EmailService implements IEmailService {
  constructor(
    @Inject(EMAIL_PROVIDER)
    private readonly emailProvider: IEmailProvider,
    @Inject(EMAIL_TEMPLATE_SERVICE)
    private readonly emailTemplateService: IEmailTemplateService,
    @InjectPinoLogger('EmailService') private readonly logger: PinoLogger,
  ) {}

  async sendForgotPasswordEmail(
    user: User,
    resetLink: string,
  ): Promise<boolean> {
    try {
      await this.emailProvider.send({
        to: user.email,
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
}
