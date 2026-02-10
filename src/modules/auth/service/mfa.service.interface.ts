import { MfaData, ValidateMfa } from '../dtos';

export interface IMfaService {
  generateMfa(userId: string): Promise<MfaData>;
  enableMfa(userId: string, code: string): Promise<boolean>;
  validateMfa(
    userId: string,
    code: string,
    isActivating?: boolean,
  ): Promise<ValidateMfa>;
}
