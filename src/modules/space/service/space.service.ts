import { Inject, Injectable } from '@nestjs/common';
import { ISpaceService } from './space.service.interface';
import { ESpaceMemberRole, Space } from '../../../@types';
import { CreateSpaceDto, UpdateSpaceDto } from '../dtos';
import { SPACE_REPOSITORY } from '../tokens';
import { type ISpaceRepository } from '../repository';
import { AppError } from '../../../@errors/app-error';
import { APP_ERRORS } from '../../../@errors';
import { type IUnitOfWork, UOW_PROVIDER } from '../../unit-of-work';

@Injectable()
export class SpaceService implements ISpaceService {
  constructor(
    @Inject(SPACE_REPOSITORY)
    private readonly spaceRepository: ISpaceRepository,
    @Inject(UOW_PROVIDER)
    private readonly uow: IUnitOfWork,
  ) {}

  async createSpace(userId: string, data: CreateSpaceDto): Promise<Space> {
    const space = await this.uow.execute(async (repositories) => {
      const space = await repositories.space.createSpace({
        name: data.name,
        isPersonal: false,
        ownerId: userId,
      });

      await repositories.spaceMember.addMember(
        space.id,
        userId,
        ESpaceMemberRole.OWNER,
      );

      return space;
    });

    return space;
  }

  async getSpace(userId: string, spaceId: string): Promise<Space> {
    const space = await this.spaceRepository.getSpace(userId, spaceId);

    if (!space) {
      throw new AppError(APP_ERRORS.SPACE_NOT_FOUND);
    }

    return space;
  }

  async getMyPersonalSpace(userId: string): Promise<Space> {
    const space = await this.spaceRepository.getMyPersonalSpace(userId);

    if (!space) {
      throw new AppError(APP_ERRORS.INTERNAL_SERVER_ERROR);
    }

    return space;
  }

  async listMySpaces(userId: string): Promise<Space[]> {
    const mySpaces = await this.spaceRepository.listMySpaces(userId);

    return mySpaces;
  }

  async deleteSpace(userId: string, spaceId: string): Promise<void> {
    const space = await this.getSpace(userId, spaceId);

    if (space.isPersonal) {
      throw new AppError(APP_ERRORS.DELETE_PERSONAL_SPACE_NOT_ALLOWED);
    }

    await this.spaceRepository.deleteSpace(userId, spaceId);
  }

  async updateSpace(
    userId: string,
    spaceId: string,
    data: UpdateSpaceDto,
  ): Promise<Space> {
    const space = await this.getSpace(userId, spaceId);

    if (!space) {
      throw new AppError(APP_ERRORS.SPACE_NOT_FOUND);
    }

    if (space.isPersonal) {
      throw new AppError(APP_ERRORS.UPDATE_PERSONAL_SPACE_NOT_ALLOWED);
    }

    const updatedSpace = await this.spaceRepository.updateSpace(
      userId,
      spaceId,
      data,
    );

    if (!updatedSpace) {
      throw new AppError(APP_ERRORS.INTERNAL_SERVER_ERROR);
    }

    return updatedSpace;
  }
}
