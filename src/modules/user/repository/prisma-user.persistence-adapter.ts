import { PrismaService } from '../../prisma';
import { Injectable } from '@nestjs/common';
import { CreateUser } from '../dtos';
import { User } from '../../../@types';
import { IUserRepository } from './user.repository.interface';

@Injectable()
export class PrismaUserPersistenceAdapter implements IUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateUser): Promise<User> {
    return await this.prismaService.user.create({
      data,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: { email },
    });
  }

  async find(idOrEmail: string): Promise<User | null> {
    return await this.prismaService.user.findFirst({
      where: { OR: [{ id: idOrEmail }, { email: idOrEmail }] },
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
}
