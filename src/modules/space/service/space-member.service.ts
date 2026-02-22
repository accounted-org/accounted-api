import { Inject, Injectable } from '@nestjs/common';
import { ESpaceMemberRole, SpaceMember } from '../../../@types';
import { ISpaceMemberService } from './space-member.service.interface';
import { SPACE_MEMBER_REPOSITORY, SPACE_SERVICE } from '../tokens';
import { type ISpaceMemberRepository } from '../repository';
import { APP_ERRORS } from '../../../@errors';
import { AppError } from '../../../@errors/app-error';
import { type ISpaceService } from './space.service.interface';
import { type IUserService, USER_SERVICE } from '../../user';

@Injectable()
export class SpaceMemberService implements ISpaceMemberService {
  constructor(
    @Inject(SPACE_MEMBER_REPOSITORY)
    private readonly spaceMemberRepository: ISpaceMemberRepository,
    @Inject(SPACE_SERVICE)
    private readonly spaceService: ISpaceService,
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
  ) {}

  async listSpaceMembers(spaceId: string): Promise<SpaceMember[]> {
    const spaceMembers = await this.spaceMemberRepository.listMembers(spaceId);
    return spaceMembers;
  }

  async getSpaceMember(
    spaceId: string,
    memberId: string,
  ): Promise<SpaceMember> {
    const spaceMember = await this.spaceMemberRepository.getMember(
      spaceId,
      memberId,
    );

    if (!spaceMember) {
      throw new AppError(APP_ERRORS.SPACE_MEMBER_NOT_FOUND);
    }

    return spaceMember;
  }

  async addSpaceMember(
    userId: string,
    spaceId: string,
    memberId: string,
  ): Promise<SpaceMember> {
    // verifica se não está adicionando ele mesmo como membro
    if (userId === memberId) {
      throw new AppError(APP_ERRORS.CANNOT_ADD_HIMSELF_AS_MEMBER);
    }

    // verifica se o space existe
    const space = await this.spaceService.getSpace(userId, spaceId);

    if (!space) {
      throw new AppError(APP_ERRORS.SPACE_NOT_FOUND);
    }

    // verifica se o user tem permissão para adicionar membros
    // to-do: criar regra de permissão mais robusta
    const currentSpaceMember = await this.spaceMemberRepository.getMember(
      spaceId,
      userId,
    );

    if (!currentSpaceMember) {
      throw new AppError(APP_ERRORS.SPACE_MEMBER_NOT_FOUND);
    }

    // verifica se o membro já é parte do espaço
    const existingMember = await this.spaceMemberRepository.getMember(
      spaceId,
      memberId,
    );

    if (existingMember) {
      throw new AppError(APP_ERRORS.SPACE_MEMBER_ALREADY_EXISTS);
    }

    // verifica se o usuário existe
    const memberUser = await this.userService.findById(memberId);

    if (!memberUser) {
      throw new AppError(APP_ERRORS.USER_NOT_FOUND);
    }

    const newSpaceMember = await this.spaceMemberRepository.addMember(
      spaceId,
      memberId,
      ESpaceMemberRole.MEMBER,
    );

    return newSpaceMember;
  }

  async removeSpaceMember(
    userId: string,
    spaceId: string,
    memberId: string,
  ): Promise<void> {
    if (userId === memberId) {
      throw new AppError(APP_ERRORS.CANNOT_REMOVE_HIMSELF_AS_MEMBER);
    }

    const memberToRemove = await this.spaceMemberRepository.getMember(
      spaceId,
      memberId,
    );

    if (!memberToRemove) {
      throw new AppError(APP_ERRORS.SPACE_MEMBER_NOT_FOUND);
    }

    if (memberToRemove.role === ESpaceMemberRole.OWNER.toString()) {
      throw new AppError(APP_ERRORS.ACTION_NOT_ALLOWED_IN_THIS_SPACE);
    }

    const useHasPermission = await this.validatePermissions(memberId, spaceId);

    if (!useHasPermission) {
      throw new AppError(APP_ERRORS.ACTION_NOT_ALLOWED_IN_THIS_SPACE);
    }

    await this.spaceMemberRepository.removeMember(spaceId, memberId);
  }

  private async validatePermissions(userId: string, spaceId: string) {
    console.log('Validating permissions for user', userId, 'on space', spaceId);

    return await Promise.resolve(true); // to-do: implementar lógica de permissão
  }
}
