import { Injectable } from '@nestjs/common';

import { ISpaceMemberRepository } from './space-member.repository.interface';
import { SpaceMember } from '../../../@types';

import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaSpaceMemberPersistenceAdapter implements ISpaceMemberRepository {
  constructor(private prismaService: PrismaClient | Prisma.TransactionClient) {}

  async addMember(
    spaceId: string,
    memberId: string,
    role: string,
  ): Promise<SpaceMember> {
    return await this.prismaService.spaceMember.create({
      data: {
        spaceId,
        memberId,
        role,
      },
    });
  }

  async getMember(
    spaceId: string,
    memberId: string,
  ): Promise<SpaceMember | null> {
    return await this.prismaService.spaceMember.findUnique({
      where: {
        spaceId_memberId: {
          spaceId,
          memberId,
        },
      },
    });
  }

  async removeMember(spaceId: string, memberId: string): Promise<void> {
    await this.prismaService.spaceMember.deleteMany({
      where: {
        spaceId,
        memberId,
      },
    });
  }

  async listMembers(spaceId: string): Promise<SpaceMember[]> {
    return await this.prismaService.spaceMember.findMany({
      where: {
        spaceId,
      },
    });
  }
}
