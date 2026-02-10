import { PrismaService } from '../../prisma';
import { Injectable } from '@nestjs/common';
import { CreateUser, UpdateUser } from '../dtos';
import { User } from '../../../@types';
import { IUserRepository } from './user.repository.interface';

@Injectable()
export class PrismaUserPersistenceAdapter implements IUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateUser): Promise<User> {
    return await this.prismaService.user.create({
      data: {
        ...data,
        mfaEnabled: false,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prismaService.user.findFirst({
      where: { email, active: true },
    });
  }

  async find(idOrEmail: string): Promise<User | null> {
    return await this.prismaService.user.findFirst({
      where: { OR: [{ id: idOrEmail }, { email: idOrEmail }], active: true },
    });
  }

  async incrementTokenVersion(userId: string): Promise<User | null> {
    return await this.prismaService.user.update({
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

  async update(
    userId: string,
    data: UpdateUser,
    revokeSession?: boolean,
  ): Promise<User | null> {
    return await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        ...data,
        tokenVersion: revokeSession ? { increment: 1 } : undefined,
      },
    });
  }

  async delete(userId: string): Promise<User | null> {
    return await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        active: false,
      },
    });
  }
}
