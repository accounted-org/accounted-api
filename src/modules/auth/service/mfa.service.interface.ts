import { MfaData, ValidateMfa } from '../dtos';

export interface IMfaService {
  generateMfa(userId: string): Promise<MfaData>;
  verifyMfa(
    tempToken: string,
    code: string,
    isActivating?: boolean,
  ): Promise<ValidateMfa>;
  revalidateMfa(userId: string, code: string): Promise<boolean>;
}
