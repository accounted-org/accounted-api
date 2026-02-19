import { Space } from '../../../@types';
import { CreateSpaceDto } from '../dtos';

export interface ISpaceService {
  createSpace(userId: string, data: CreateSpaceDto): Promise<Space>;
  getMyPersonalSpace(userId: string): Promise<Space>;
  getSpace(userId: string, spaceId: string): Promise<Space>;
  getMyPersonalSpace(userId: string): Promise<Space>;
  listMySpaces(userId: string): Promise<Space[]>;
  deleteSpace(userId: string, spaceId: string): Promise<void>;
}
