import { Prisma } from '@prisma/client';
import { SecurityEvent, SecurityEventMetaData } from '../../../@types';
import { CreateSecurityEvent } from '../dtos';
import { ISecurityEventRepository } from './security-event.repository.interface';
import { PrismaService } from '../../prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaSecurityEventPersistenceAdapter implements ISecurityEventRepository {
  constructor(
    private readonly prismaService: PrismaService | Prisma.TransactionClient,
  ) {}

  async create(data: CreateSecurityEvent): Promise<SecurityEvent> {
    const securityEvent = await this.prismaService.securityEvent.create({
      data,
    });

    return {
      ...securityEvent,
      metadata: securityEvent.metadata as SecurityEventMetaData,
    };
  }
}
