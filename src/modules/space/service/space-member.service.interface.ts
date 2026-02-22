import { SpaceMember } from '../../../@types';

export interface ISpaceMemberService {
  listSpaceMembers(spaceId: string): Promise<SpaceMember[]>;
  getSpaceMember(spaceId: string, memberId: string): Promise<SpaceMember>;
  addSpaceMember(
    userId: string,
    spaceId: string,
    memberId: string,
  ): Promise<SpaceMember>;
  removeSpaceMember(
    userId: string,
    spaceId: string,
    memberId: string,
  ): Promise<void>;
}
