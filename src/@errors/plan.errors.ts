export const PLAN_ERRORS = {
  PLAN_ALREADY_EXISTS: { code: 'PLA_001', status: 400 },
  PLAN_NOT_FOUND: { code: 'PLA_002', status: 404 },
  PLAN_PRICE_REQUIRED: { code: 'PLA_003', status: 400 },
} as const;
