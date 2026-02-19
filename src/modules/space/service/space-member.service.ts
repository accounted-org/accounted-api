import { Inject } from '@nestjs/common';
import { ESpaceMemberRole, SpaceMember } from '../../../@types';
import { ISpaceMemberService } from './space-member.service.interface';
import { SPACE_MEMBER_REPOSITORY } from '../tokens';
import { type ISpaceMemberRepository } from '../repository';

export class SpaceMemberService implements ISpaceMemberService {
  constructor(
    @Inject(SPACE_MEMBER_REPOSITORY)
    private readonly spaceMemberRepository: ISpaceMemberRepository,
  ) {}

  async getSpaceMembers(spaceId: string): Promise<SpaceMember[]> {
    const spaceMembers = await this.spaceMemberRepository.listMembers(spaceId);
    return spaceMembers;
  }

  async addSpaceMember(
    spaceId: string,
    memberId: string,
  ): Promise<SpaceMember> {
    const spaceMember = await this.spaceMemberRepository.addMember(
      spaceId,
      memberId,
      ESpaceMemberRole.MEMBER,
    );

    return spaceMember;
  }

  async removeSpaceMember(spaceId: string, memberId: string): Promise<void> {
    await this.spaceMemberRepository.removeMember(spaceId, memberId);
  }
}
