export const AUTH_ERRORS = {
  EMAIL_ALREADY_REGISTERED: { code: 'EM_001', status: 400 },
  INVALID_CREDENTIALS: { code: 'AUT_001', status: 401 },
  INVALID_TOKEN: { code: 'AUT_002', status: 401 },
  USER_NOT_FOUND: { code: 'AUT_007', status: 404 },
  USER_UNAUTHORIZED: { code: 'AUT_003', status: 401 },
  USER_FORBIDDEN: { code: 'AUT_004', status: 403 },
  INVALID_REFRESH_TOKEN: { code: 'AUT_005', status: 401 },
  INVALID_2FA: { code: 'AUT_006', status: 401 },
} as const;
