import { PublicUser, User } from '../../../@types';
import { CreateUser, UpdateUserDto } from '../dtos';

export interface IUserService {
  createProviderUser(data: CreateUser): Promise<User>;
  validateUserIdentity(idOrEmail: string): Promise<User | null>;
  getProfile(userId: string): Promise<Partial<User>>;
  findById(userId: string): Promise<User>;
  findByEmail(userId: string): Promise<User>;
  safeFind(idOrEmail: string): Promise<User | null>;
  updateUser(userId: string, data: UpdateUserDto): Promise<PublicUser>;
  deleteUser(userId: string): Promise<void>;
}
