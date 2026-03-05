import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PaginationParams, Plan, PlanWithPrices } from '../../../@types';
import { CreatePlan, UpdatePlan } from '../dtos';
import { IPlanRepository } from './plan.repository.interface';

@Injectable()
export class PrismaPlanPersistenceAdapter implements IPlanRepository {
  constructor(private readonly prismaService: PrismaClient) {}

  async create(data: CreatePlan): Promise<Plan> {
    const { planPrices, ...planData } = data;

    return this.prismaService.$transaction(async (tx) => {
      const createdPlan = await tx.plan.create({
        data: planData,
      });

      await tx.planPrice.createMany({
        data: planPrices.map((price) => ({
          ...price,
          planId: createdPlan.id,
          countryCode: price.countryCode.toUpperCase(),
          currency: price.currency.toUpperCase(),
        })),
      });

      return createdPlan;
    });
  }

  async findById(id: string): Promise<PlanWithPrices | null> {
    return this.prismaService.plan.findUnique({
      where: { id },
      include: { prices: true },
    });
  }

  async findByCode(code: string): Promise<PlanWithPrices | null> {
    return this.prismaService.plan.findUnique({
      where: { code },
      include: { prices: true },
    });
  }

  async findByIdOrCode(idOrCode: string): Promise<PlanWithPrices | null> {
    return this.prismaService.plan.findFirst({
      where: {
        OR: [{ id: idOrCode }, { code: idOrCode }],
      },
      include: { prices: true },
    });
  }

  async findMany(
    params: PaginationParams & { query?: string; isActive?: boolean },
  ): Promise<{ items: PlanWithPrices[]; total: number }> {
    const { page, limit, query, isActive } = params;

    const where: Prisma.PlanWhereInput = {};

    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    if (query) {
      const normalizedQuery = query.trim();

      where.OR = [
        { code: { contains: normalizedQuery, mode: 'insensitive' } },
        { promoTextKey: { contains: normalizedQuery, mode: 'insensitive' } },
        {
          prices: {
            some: {
              countryCode: {
                contains: normalizedQuery,
                mode: 'insensitive',
              },
            },
          },
        },
      ];
    }

    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.plan.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { prices: true },
      }),
      this.prismaService.plan.count({ where }),
    ]);

    return { items, total };
  }

  async update(id: string, data: UpdatePlan): Promise<Plan> {
    const { planPrices, ...planData } = data;

    return this.prismaService.$transaction(async (tx) => {
      const updatedPlan = await tx.plan.update({
        where: { id },
        data: planData,
      });

      if (planPrices) {
        for (const price of planPrices) {
          await tx.planPrice.upsert({
            where: {
              planId_countryCode: {
                planId: id,
                countryCode: price.countryCode.toUpperCase(),
              },
            },
            update: {
              currency: price.currency.toUpperCase(),
              price: price.price,
              discountPercent: price.discountPercent,
              isActive: price.isActive,
            },
            create: {
              planId: id,
              countryCode: price.countryCode.toUpperCase(),
              currency: price.currency.toUpperCase(),
              price: price.price,
              discountPercent: price.discountPercent,
              isActive: price.isActive,
            },
          });
        }
      }

      return updatedPlan;
    });
  }

  async delete(id: string): Promise<Plan> {
    return this.prismaService.plan.delete({
      where: { id },
    });
  }
}
