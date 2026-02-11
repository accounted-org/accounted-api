// to-do: usar essa separação de intern e public para criar dois models separados no prisma: user e auth

export type UserIntern = {
  id: string;
  passwordHash: string | null;
  tokenVersion: number;
  active: boolean;
  provider: string;

  mfaSecret: string | null;
  mfaEnabled: boolean;
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
