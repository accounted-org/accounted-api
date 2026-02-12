export type PublicUser = {
  id: string;
  email: string;
  name: string;
  preferredLanguage: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  id: string;
  email: string;
  name: string;
  preferredLanguage: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};
