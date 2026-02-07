export type UpdateUser = {
  name?: string;
  email?: string;
  tokenVersion?: number;
  passwordHash?: string;
  mfaEnabled?: boolean;
  mfaSecret?: string | null;
};
