export type UserIntern = {
  id: string;
  passwordHash: string | null;
  mfaSecret: string | null;
  tokenVersion: number;
  mfaEnabled: boolean;
  active: boolean;
  provider: string;
  mfaLastVerifiedAt: Date | null;
  emailChangeRequestedAt: Date | null;
};

export type PublicUser = {
  id: string;
  email: string;
  name: string;
  preferredLanguage: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type User = PublicUser & UserIntern;
