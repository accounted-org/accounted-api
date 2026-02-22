import { Injectable } from '@nestjs/common';
import { ESpaceMemberRole, Space } from '../../../@types';
import { CreateSpace } from '../dtos';
import { ISpaceRepository } from './space.repository.interface';

import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaSpacePersistenceAdapter implements ISpaceRepository {
  constructor(private prismaService: PrismaClient | Prisma.TransactionClient) {}

  async createSpace(data: CreateSpace): Promise<Space> {
    return await this.prismaService.space.create({
      data: {
        name: data.name,
        isPersonal: data.isPersonal,
        ownerId: data.ownerId,
      },
    });
  }

  async getMyPersonalSpace(userId: string): Promise<Space | null> {
    return await this.prismaService.space.findFirst({
      where: {
        isPersonal: true,
        spaceMembers: {
          some: {
            memberId: userId,
            role: ESpaceMemberRole.OWNER,
          },
        },
      },
    });
  }

  async listMySpaces(userId: string): Promise<Space[]> {
    return await this.prismaService.space.findMany({
      where: {
        spaceMembers: {
          some: {
            memberId: userId,
            role: ESpaceMemberRole.OWNER,
          },
        },
      },
    });
  }

  async getSpace(userId: string, spaceId: string): Promise<Space | null> {
    return await this.prismaService.space.findUnique({
      where: {
        id: spaceId,
        spaceMembers: {
          some: {
            memberId: userId,
          },
        },
      },
    });
  }

  async deleteSpace(userId: string, spaceId: string): Promise<Space | null> {
    return await this.prismaService.space.delete({
      where: {
        id: spaceId,
        spaceMembers: {
          some: {
            memberId: userId,
            role: ESpaceMemberRole.OWNER,
          },
        },
      },
    });
  }
}
