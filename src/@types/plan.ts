export type Plan = {
  id: string;
  code: string;
  promoTextKey: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type PlanPrice = {
  id: string;
  planId: string;
  countryCode: string;
  currency: string;
  price: number;
  discountPercent: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type PlanWithPrices = Plan & {
  prices: PlanPrice[];
};
