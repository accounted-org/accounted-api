import { SpaceMember } from '../../../@types';

export interface ISpaceMemberRepository {
  addMember(
    spaceId: string,
    memberId: string,
    role: string,
  ): Promise<SpaceMember>;
  getMember(spaceId: string, memberId: string): Promise<SpaceMember | null>;
  removeMember(spaceId: string, memberId: string): Promise<void>;
  listMembers(spaceId: string): Promise<SpaceMember[]>;
}
