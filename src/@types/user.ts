export type User = {
  id: string;
  email: string;
  name: string;
  tokenVersion: number;
  mfaEnabled: boolean;
  preferredLanguage: string | null;
  mfaSecret: string | null;
  passwordHash: string | null;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
};
