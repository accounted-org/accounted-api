import { PrismaService } from '../../prisma';
import { Injectable } from '@nestjs/common';
import { CreateUser, UpdateUser } from '../dtos';
import { User } from '../../../@types';
import { IUserRepository } from './user.repository.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaUserPersistenceAdapter implements IUserRepository {
  constructor(
    private readonly prismaService: PrismaService | Prisma.TransactionClient,
  ) {}

  async create(data: CreateUser): Promise<User> {
    return await this.prismaService.user.create({
      data: {
        ...data,
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

  async update(userId: string, data: UpdateUser): Promise<User> {
    return await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data,
    });
  }

  async delete(userId: string): Promise<User | null> {
    return await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        active: false,
        email: `deleted_${userId}@deleted.local`,
      },
    });
  }
}
