import { Space } from '../../../@types';
import { CreateSpace, UpdateSpace } from '../dtos';

export interface ISpaceRepository {
  createSpace(data: CreateSpace): Promise<Space>;
  getMyPersonalSpace(userId: string): Promise<Space | null>;
  getSpace(userId: string, spaceId: string): Promise<Space | null>;
  getMyPersonalSpace(userId: string): Promise<Space | null>;
  listMySpaces(userId: string): Promise<Space[]>;
  deleteSpace(userId: string, spaceId: string): Promise<Space | null>;
  updateSpace(
    userId: string,
    spaceId: string,
    data: UpdateSpace,
  ): Promise<Space | null>;
}
