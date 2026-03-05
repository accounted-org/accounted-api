import { PaginatedResponse, Plan, PlanWithPrices } from '../../../@types';
import {
  CreatePlanDto,
  ListPlansQueryDto,
  UpdatePlanDto,
} from '../dtos';

export interface IPlanService {
  createPlan(data: CreatePlanDto): Promise<Plan>;
  getPlanByIdOrCode(idOrCode: string): Promise<PlanWithPrices>;
  getPlanById(id: string): Promise<PlanWithPrices>;
  listPlans(query: ListPlansQueryDto): Promise<PaginatedResponse<PlanWithPrices>>;
  updatePlan(id: string, data: UpdatePlanDto): Promise<Plan>;
  deletePlan(id: string): Promise<void>;
}
