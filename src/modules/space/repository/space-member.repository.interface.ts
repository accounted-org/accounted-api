import { SpaceMember } from '../../../@types';

export interface ISpaceMemberRepository {
  addMember(
    spaceId: string,
    memberId: string,
    role: string,
  ): Promise<SpaceMember>;
  removeMember(spaceId: string, memberId: string): Promise<void>;
  listMembers(spaceId: string): Promise<SpaceMember[]>;
}
