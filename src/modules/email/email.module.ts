import { Global, Module, Provider } from '@nestjs/common';
import {
  EMAIL_PROVIDER,
  EMAIL_SERVICE,
  EMAIL_TEMPLATE_SERVICE,
} from './tokens';
import { OracleEmailProvider } from './providers';
import { EmailService, HbsEmailTemplateService } from './service';

const providers: Provider[] = [
  {
    provide: EMAIL_SERVICE,
    useClass: EmailService,
  },
];

@Global()
@Module({
  providers: [
    {
      provide: EMAIL_PROVIDER,
      useClass: OracleEmailProvider,
    },
    {
      provide: EMAIL_TEMPLATE_SERVICE,
      useClass: HbsEmailTemplateService,
    },
    ...providers,
  ],
  exports: [...providers],
})
export class EmailModule {}
