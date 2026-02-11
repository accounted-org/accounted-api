export type ValidateMfa = {
  success: boolean;
  mfaLastVerifiedAt: Date;
  accessToken: string;
};
