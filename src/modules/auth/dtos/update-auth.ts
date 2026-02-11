export type UpdateAuth = {
  passwordHash?: string;
  provider?: string;
  tokenVersion?: number;

  mfaEnabled?: boolean;
  mfaSecret?: string | null;
  mfaLastVerifiedAt?: Date | null;
};
