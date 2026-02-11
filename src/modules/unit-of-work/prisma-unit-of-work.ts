import { Injectable } from '@nestjs/common';
import { IRepositories, IUnitOfWork } from './unit-of-work.interface';
import { PrismaService } from '../prisma';
import { PrismaUserPersistenceAdapter } from '../user/repository';
import { PrismaAuthPersistenceAdapter } from '../auth/repository';

@Injectable()
export class PrismaUnitOfWork implements IUnitOfWork {
  constructor(private readonly prisma: PrismaService) {}

  async execute<T>(
    work: (repositories: IRepositories) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(async (tx) => {
      const repositories: IRepositories = {
        users: new PrismaUserPersistenceAdapter(tx),
        auth: new PrismaAuthPersistenceAdapter(tx),
      };

      return work(repositories);
    });
  }
}
