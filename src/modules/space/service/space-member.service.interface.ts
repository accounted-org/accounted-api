import { SpaceMember } from '../../../@types';

export interface ISpaceMemberService {
  getSpaceMembers(spaceId: string): Promise<SpaceMember[]>;
  addSpaceMember(spaceId: string, memberId: string): Promise<SpaceMember>;
  removeSpaceMember(spaceId: string, memberId: string): Promise<void>;
}
