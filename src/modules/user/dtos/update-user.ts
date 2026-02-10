export type UpdateUser = {
  name?: string;
  email?: string;
  active?: boolean;
  tokenVersion?: number;
  passwordHash?: string;
  mfaEnabled?: boolean;
  mfaSecret?: string | null;
  mfaLastVerifiedAt?: Date | null;
  emailChangeRequestedAt?: Date | null;
};
