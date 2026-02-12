export type UpdateAuth = {
  passwordHash?: string;
  provider?: string;
  tokenVersion?: number;

  emailChangeRequestedAt?: Date | null;

  mfaEnabled?: boolean;
  mfaSecret?: string | null;
  mfaLastVerifiedAt?: Date | null;
};
