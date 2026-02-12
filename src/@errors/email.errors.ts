export const EMAIL_ERRORS = {
  EMAIL_ALREADY_REGISTERED: { code: 'EM_001', status: 400 },
  TEMPLATE_NOT_FOUND: { code: 'TMP_001', status: 404 },
  EMAIL_STRATEGY_NOT_FOUND: { code: 'STG_001', status: 404 },
} as const;
