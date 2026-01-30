import { PrismaService } from '../../prisma';
import { Injectable } from '@nestjs/common';
import { CreateUser } from '../dtos';
import { User } from '@types';
import { IUserRepository } from './user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  // error no import do prisma, não ta injetando direito
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
}
