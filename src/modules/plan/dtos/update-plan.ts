import { CreatePlanPrice } from './create-plan-price';

export type UpdatePlan = {
  code?: string;
  promoTextKey?: string;
  isActive?: boolean;
  planPrices?: CreatePlanPrice[];
};
