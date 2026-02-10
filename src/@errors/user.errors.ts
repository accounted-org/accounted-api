export const USER_ERRORS = {
  USER_UNAUTHORIZED: { code: 'AUT_003', status: 401 },
  USER_FORBIDDEN: { code: 'AUT_004', status: 403 },
  USER_NOT_FOUND: { code: 'AUT_007', status: 404 },
} as const;
