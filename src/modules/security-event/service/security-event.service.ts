import { Inject, Injectable } from '@nestjs/common';
import { SecurityEvent } from '../../../@types';
import { CreateSecurityEvent } from '../dtos';
import { ISecurityEventService } from './security-event.service.interface';
import { SECURITY_EVENT_REPOSITORY } from '../tokens';
import { type ISecurityEventRepository } from '../repository';

@Injectable()
export class SecurityEventService implements ISecurityEventService {
  constructor(
    @Inject(SECURITY_EVENT_REPOSITORY)
    private readonly securityEventRepository: ISecurityEventRepository,
  ) {}

  async create(data: CreateSecurityEvent): Promise<SecurityEvent> {
    return await this.securityEventRepository.create(data);
  }
}
