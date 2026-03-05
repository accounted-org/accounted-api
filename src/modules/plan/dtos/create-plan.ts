import { CreatePlanPrice } from './create-plan-price';

export type CreatePlan = {
  code: string;
  promoTextKey?: string;
  isActive?: boolean;
  planPrices: CreatePlanPrice[];
};
