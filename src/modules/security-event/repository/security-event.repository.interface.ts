import { SecurityEvent } from '../../../@types';
import { CreateSecurityEvent } from '../dtos';

export interface ISecurityEventRepository {
  create(data: CreateSecurityEvent): Promise<SecurityEvent>;
}
