export const SPACE_ERRORS = {
  SPACE_NOT_FOUND: { code: 'SPC_001', status: 404 },
  DELETE_PERSONAL_SPACE_NOT_ALLOWED: { code: 'SPC_002', status: 403 },
  SPACE_NOT_EMPTY: { code: 'SPC_003', status: 403 },
  SPACE_MEMBER_NOT_FOUND: { code: 'SPC_004', status: 404 },
  SPACE_MEMBER_ALREADY_EXISTS: { code: 'SPC_005', status: 400 },
  CANNOT_ADD_HIMSELF_AS_MEMBER: { code: 'SPC_006', status: 400 },
  ACTION_NOT_ALLOWED_IN_THIS_SPACE: { code: 'SPC_007', status: 403 },
  CANNOT_REMOVE_HIMSELF_AS_MEMBER: { code: 'SPC_008', status: 400 },
  UPDATE_PERSONAL_SPACE_NOT_ALLOWED: { code: 'SPC_009', status: 403 },
} as const;
