import { PaginationParams, Plan, PlanWithPrices } from '../../../@types';
import { CreatePlan, UpdatePlan } from '../dtos';

export interface IPlanRepository {
  create(data: CreatePlan): Promise<Plan>;
  findById(id: string): Promise<PlanWithPrices | null>;
  findByCode(code: string): Promise<PlanWithPrices | null>;
  findByIdOrCode(idOrCode: string): Promise<PlanWithPrices | null>;
  findMany(
    params: PaginationParams & {
      query?: string;
      isActive?: boolean;
    },
  ): Promise<{ items: PlanWithPrices[]; total: number }>;
  update(id: string, data: UpdatePlan): Promise<Plan>;
  delete(id: string): Promise<Plan>;
}
