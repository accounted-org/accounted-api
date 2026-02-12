import { PublicUser, User } from '../../../@types';
import { UpdateUserDto } from '../dtos';

export interface IUserService {
  validateUserIdentity(idOrEmail: string): Promise<User | null>;
  getProfile(userId: string): Promise<Partial<User>>;
  findById(userId: string): Promise<User>;
  findByEmail(userId: string): Promise<User>;
  safeFind(idOrEmail: string): Promise<User | null>;
  updateUser(userId: string, data: UpdateUserDto): Promise<PublicUser>;
  deleteUser(userId: string): Promise<void>;
}
