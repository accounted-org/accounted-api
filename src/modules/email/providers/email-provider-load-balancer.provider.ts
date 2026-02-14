import { Inject, Injectable } from '@nestjs/common';
import { IEmailPayload, IEmailProvider } from './email.provider.interface';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { EMAIL_PROVIDERS } from '../tokens';

@Injectable()
export class EmailProviderLoadBalancer implements IEmailProvider {
  readonly name = 'load-balancer';

  private currentIndex = 0;

  constructor(
    @Inject(EMAIL_PROVIDERS)
    private readonly providers: IEmailProvider[],
    @InjectPinoLogger(EmailProviderLoadBalancer.name)
    private readonly logger: PinoLogger,
  ) {}

  async send(options: IEmailPayload): Promise<string | undefined> {
    const total = this.providers.length;
    let attempts = 0;
    let lastError: unknown;

    while (attempts < total) {
      const provider = this.getNext();

      try {
        this.logger.info(
          `Trying sending email with "${provider.name}" provider`,
        );

        return await provider.send(options);
      } catch (error) {
        lastError = error;
        attempts++;

        this.logger.warn(
          `Fail sending email with "${provider.name}" provider`,
          error,
        );
      }
    }

    this.logger.error('All email providers failed');

    throw lastError;
  }

  private getNext(): IEmailProvider {
    const provider = this.providers[this.currentIndex];

    this.currentIndex = (this.currentIndex + 1) % this.providers.length;

    return provider;
  }
}
