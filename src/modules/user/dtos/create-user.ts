export type CreateUser = {
  name: string;
  email: string;
  passwordHash?: string;
  provider: string;
};
