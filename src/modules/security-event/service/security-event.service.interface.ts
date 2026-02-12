import { SecurityEvent } from '../../../@types';
import { CreateSecurityEvent } from '../dtos';

export interface ISecurityEventService {
  create(data: CreateSecurityEvent): Promise<SecurityEvent>;
}
