import { Prisma } from '@prisma/client';
import { Auth } from '../../../@types/auth';
import { PrismaService } from '../../prisma';
import { CreateAuth, UpdateAuth } from '../dtos';
import { IAuthRepository } from './auth.repository.interface';

export class PrismaAuthPersistenceAdapter implements IAuthRepository {
  constructor(
    private readonly prismaService: PrismaService | Prisma.TransactionClient,
  ) {}

  async updateAuth(userId: string, data: UpdateAuth): Promise<Auth> {
    return await this.prismaService.auth.update({
      where: {
        userId,
      },
      data,
    });
  }

  async findUserAuthData(userId: string): Promise<Auth | null> {
    return await this.prismaService.auth.findUnique({
      where: {
        userId,
      },
    });
  }

  async createAuthData(data: CreateAuth): Promise<Auth> {
    return await this.prismaService.auth.create({
      data,
    });
  }

  async incrementTokenVersion(userId: string): Promise<Auth | null> {
    return await this.prismaService.auth.update({
      where: {
        id: userId,
      },
      data: {
        tokenVersion: {
          increment: 1,
        },
      },
    });
  }
}
