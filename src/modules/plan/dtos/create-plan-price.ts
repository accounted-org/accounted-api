export type CreatePlanPrice = {
  countryCode: string;
  currency: string;
  price: number;
  discountPercent?: number;
  isActive?: boolean;
};

