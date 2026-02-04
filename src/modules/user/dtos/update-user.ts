export type UpdateUser = {
  name?: string;
  email?: string;
  tokenVersion?: number;
  mfaEnabled?: boolean;
  mfaSecret?: string | null;
};
