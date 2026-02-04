export type User = {
  id: string;
  email: string;
  name: string;
  tokenVersion: number;
  mfaEnabled: boolean;
  mfaSecret: string | null;
  passwordHash: string | null;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
};
