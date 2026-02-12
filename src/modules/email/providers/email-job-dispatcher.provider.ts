import { Injectable } from '@nestjs/common';
import { MailJobStrategyList, MailJobStrategy } from '../@types';
import { AppError } from '../../../@errors/app-error';
import { APP_ERRORS } from '../../../@errors';

@Injectable()
export class EmailJobDispatcher {
  private readonly strategies = new Map<
    string,
    MailJobStrategy<MailJobStrategyList>
  >();

  constructor(strategies: MailJobStrategy<MailJobStrategyList>[]) {
    for (const strategy of strategies) {
      this.strategies.set(strategy.jobName, strategy);
    }
  }

  async dispatch(jobName: string, data: MailJobStrategyList) {
    const strategy = this.strategies.get(jobName);

    if (!strategy) {
      throw new AppError(APP_ERRORS.EMAIL_STRATEGY_NOT_FOUND);
    }

    await strategy.handle(data);
  }
}
