export type Auth = {
  id: string;
  userId: string;

  passwordHash: string | null;
  provider: string;
  tokenVersion: number;

  emailChangeRequestedAt: Date | null;

  mfaEnabled: boolean;
  mfaSecret: string | null;
  mfaLastVerifiedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
};
