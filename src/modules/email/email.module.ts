import { Global, Module, Provider } from '@nestjs/common';
import {
  EMAIL_PROVIDER,
  EMAIL_SERVICE,
  EMAIL_TEMPLATE_SERVICE,
  EMAIL_JOB_STRATEGIES,
  EMAIL_QUEUE,
  EMAIL_QUEUE_NAME,
  EMAIL_QUEUE_SERVICE,
  EMAIL_PROVIDERS,
  EMAIL_JOB_DISPATCHER,
} from './tokens';
import {
  EmailJobDispatcher,
  EmailProviderLoadBalancer,
  MailgunEmailProvider,
  OracleEmailProvider,
} from './providers';
import {
  BullMQMailQueueService,
  EmailService,
  HbsEmailTemplateService,
} from './service';
import {
  SendChangeEmailRequestEmailStrategy,
  SendForgotPasswordStrategy,
  SendNotifyEmailChangedStrategy,
  SendPasswordChangedEmailStrategy,
} from './strategy';

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
      const queue = new Queue(EMAIL_QUEUE_NAME, {
        connection: {
          host: configService.get('REDIS_HOST'),
          port: Number(configService.get<number>('REDIS_PORT')),
          password: configService.get('REDIS_PASSWORD'),
        },
      });

      return queue;
    },
  },
  {
    provide: EMAIL_QUEUE_SERVICE,
    useClass: BullMQMailQueueService,
  },
];

@Global()
@Module({
  providers: [
    SendChangeEmailRequestEmailStrategy,
    SendForgotPasswordStrategy,
    SendNotifyEmailChangedStrategy,
    SendPasswordChangedEmailStrategy,
    OracleEmailProvider,
    MailgunEmailProvider,
    {
      provide: EMAIL_PROVIDER,
      useClass: EmailProviderLoadBalancer,
    },
    {
      provide: EMAIL_TEMPLATE_SERVICE,
      useClass: HbsEmailTemplateService,
    },
    {
      provide: EMAIL_JOB_DISPATCHER,
      useClass: EmailJobDispatcher,
    },
    {
      provide: EMAIL_PROVIDERS,
      useFactory: (
        oracle: OracleEmailProvider,
        mailgun: MailgunEmailProvider,
      ) => [oracle, mailgun],
      inject: [OracleEmailProvider, MailgunEmailProvider],
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
    ...exportedProviders,
  ],
  exports: [...exportedProviders],
})
export class EmailModule {}
