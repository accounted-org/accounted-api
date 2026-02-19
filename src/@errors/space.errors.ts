export const SPACE_ERRORS = {
  SPACE_NOT_FOUND: { code: 'SPC_001', status: 404 },
  DELETE_PERSONAL_SPACE_NOT_ALLOWED: { code: 'SPC_002', status: 403 },
  SPACE_NOT_EMPTY: { code: 'SPC_003', status: 403 },
} as const;
