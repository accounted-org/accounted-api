import { Global, Module, Provider } from '@nestjs/common';
import {
  EMAIL_PROVIDER,
  EMAIL_SERVICE,
  EMAIL_TEMPLATE_SERVICE,
  EMAIL_JOB_STRATEGIES,
  EMAIL_QUEUE,
  EMAIL_QUEUE_NAME,
} from './tokens';
import { EmailJobDispatcher, OracleEmailProvider } from './providers';
import { EmailService, HbsEmailTemplateService } from './service';
import {
  SendChangeEmailRequestEmailStrategy,
  SendForgotPasswordStrategy,
  SendNotifyEmailChangedStrategy,
  SendPasswordChangedEmailStrategy,
} from './strategy';
import { MailJobStrategy, MailJobStrategyList } from './@types';

import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';

const exportedProviders: Provider[] = [
  {
    provide: EMAIL_SERVICE,
    useClass: EmailService,
  },
  {
    inject: [ConfigService],
    provide: EMAIL_QUEUE,
    useFactory: (configService: ConfigService) => {
      return new Queue(EMAIL_QUEUE_NAME, {
        connection: {
          host: configService.get('REDIS_HOST'),
          port: Number(configService.get<number>('REDIS_PORT')),
          password: configService.get('REDIS_PASSWORD'),
        },
      });
    },
  },
];

@Global()
@Module({
  providers: [
    SendChangeEmailRequestEmailStrategy,
    SendForgotPasswordStrategy,
    SendNotifyEmailChangedStrategy,
    SendPasswordChangedEmailStrategy,
    {
      provide: EMAIL_PROVIDER,
      useClass: OracleEmailProvider,
    },
    {
      provide: EMAIL_TEMPLATE_SERVICE,
      useClass: HbsEmailTemplateService,
    },
    {
      provide: EMAIL_JOB_STRATEGIES,
      useFactory: (
        changeEmailRequest: SendChangeEmailRequestEmailStrategy,
        forgotPassword: SendForgotPasswordStrategy,
        notifyEmailChanged: SendNotifyEmailChangedStrategy,
        passwordChanged: SendPasswordChangedEmailStrategy,
      ) => [
        changeEmailRequest,
        forgotPassword,
        notifyEmailChanged,
        passwordChanged,
      ],
      inject: [
        SendChangeEmailRequestEmailStrategy,
        SendForgotPasswordStrategy,
        SendNotifyEmailChangedStrategy,
        SendPasswordChangedEmailStrategy,
      ],
    },
    {
      provide: EmailJobDispatcher,
      useFactory: (strategies: MailJobStrategy<MailJobStrategyList>[]) =>
        new EmailJobDispatcher(strategies),
      inject: [EMAIL_JOB_STRATEGIES],
    },
    ...exportedProviders,
  ],
  exports: [...exportedProviders],
})
export class EmailModule {}
