import {
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  PaginatedResponse,
  Plan,
  PlanWithPrices,
} from '../../../@types';
import {
  CreatePlanDto,
  ListPlansQueryDto,
  UpdatePlanDto,
} from '../dtos';
import { type IPlanRepository } from '../repository';
import { PLAN_REPOSITORY } from '../tokens';
import { type IPlanService } from './plan.service.interface';
import { AppError } from '../../../@errors/app-error';
import { APP_ERRORS } from '../../../@errors';
import { PaginationUtils } from '../../utils';

@Injectable()
export class PlanService implements IPlanService {
  constructor(
    @Inject(PLAN_REPOSITORY)
    private readonly planRepository: IPlanRepository,
  ) {}

  async createPlan(data: CreatePlanDto): Promise<Plan> {
    const plan = await this.planRepository.findByCode(data.code);

    if (plan) throw new AppError(APP_ERRORS.PLAN_ALREADY_EXISTS);
    this.validateUniqueCountryCodes(data.planPrices);

    return await this.planRepository.create(data);
  }

  async getPlanById(id: string): Promise<PlanWithPrices> {
    const plan = await this.planRepository.findById(id);

    if (!plan) throw new AppError(APP_ERRORS.PLAN_NOT_FOUND);

    return plan;
  }

  async getPlanByIdOrCode(idOrCode: string): Promise<PlanWithPrices> {
    const plan = await this.planRepository.findByIdOrCode(idOrCode);

    if (!plan) throw new AppError(APP_ERRORS.PLAN_NOT_FOUND);

    return plan;
  }

  async listPlans(
    query: ListPlansQueryDto,
  ): Promise<PaginatedResponse<PlanWithPrices>> {
    const pagination = PaginationUtils.normalize({
      page: query.page,
      limit: query.limit,
    });

    const { items, total } = await this.planRepository.findMany({
      ...pagination,
      query: query.query,
      isActive: query.isActive,
    });

    return PaginationUtils.buildResponse(items, total, pagination);
  }

  async updatePlan(id: string, data: UpdatePlanDto): Promise<Plan> {
    const currentPlan = await this.getPlanById(id);

    if (!currentPlan) throw new AppError(APP_ERRORS.PLAN_NOT_FOUND);

    if (data.planPrices && data.planPrices.length === 0) {
      throw new AppError(APP_ERRORS.PLAN_PRICE_REQUIRED);
    }
    if (data.planPrices) {
      this.validateUniqueCountryCodes(data.planPrices);
    }

    if (data.code && data.code !== currentPlan.code) {
      const existingPlan = await this.planRepository.findByCode(data.code);

      if (existingPlan) {
        throw new AppError(APP_ERRORS.PLAN_ALREADY_EXISTS);
      }
    }

    return await this.planRepository.update(id, data);
  }

  async deletePlan(id: string): Promise<void> {
    const plan = await this.getPlanById(id);

    if (!plan) throw new AppError(APP_ERRORS.PLAN_NOT_FOUND);

    await this.planRepository.delete(id);
  }

  private validateUniqueCountryCodes(
    prices: Array<{ countryCode: string }>,
  ): void {
    const seen = new Set<string>();

    for (const price of prices) {
      const code = price.countryCode.toUpperCase();
      if (seen.has(code)) {
        throw new BadRequestException(
          `Duplicated countryCode '${code}' in planPrices payload`,
        );
      }
      seen.add(code);
    }
  }
}
