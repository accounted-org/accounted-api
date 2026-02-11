export type CreateAuth = {
  userId: string;
  passwordHash?: string;
  provider: string;
  tokenVersion?: number;
  mfaEnabled?: boolean;
  mfaSecret?: string;
  mfaLastVerifiedAt?: Date;
};
