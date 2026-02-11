export const SYS_ERRORS = {
  INTERNAL_SERVER_ERROR: { code: 'SYS_001', status: 500 },
  TOO_MANY_REQUESTS: { code: 'SYS_009', status: 429 },
  SERVER_ERROR: { code: 'SYS_001', status: 500 },
} as const;
