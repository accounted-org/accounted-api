export type Auth = {
  id: string;
  userId: string;

  passwordHash: string;
  provider: string;
  tokenVersion: number;

  mfaEnabled: boolean;
  mfaSecret: string | null;
  mfaLastVerifiedAt: Date | null;
};
