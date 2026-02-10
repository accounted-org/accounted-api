export const MFA_ERRORS = {
  MFA_REQUIRED: { code: 'MFA_001', status: 403 },
  MFA_EXPIRED: { code: 'MFA_002', status: 403 },
  MFA_ALREADY_ENABLED: { code: 'MFA_003', status: 400 },
  MFA_INVALID_CODE: { code: 'MFA_004', status: 401 },
  MFA_NOT_ENABLED: { code: 'MFA_005', status: 403 },
} as const;
