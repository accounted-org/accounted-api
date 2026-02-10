import { PublicUser, User } from '../../../@types';
import { SignUpDto } from '../../auth';
import { CreateUser, UpdateUserDto, UpdateUser } from '../dtos';

export interface IUserService {
  createUser(data: SignUpDto): Promise<User>;
  createProviderUser(data: CreateUser): Promise<User>;
  validateUserIdentity(idOrEmail: string): Promise<User | null>;
  incrementTokenVersion(userId: string): Promise<number>;
  getProfile(userId: string): Promise<Partial<User>>;
  findById(userId: string): Promise<User>;
  findByEmail(userId: string): Promise<User>;
  safeFind(idOrEmail: string): Promise<User | null>;
  updateUserIntern(
    userId: string,
    data: UpdateUser,
    revokeSession?: boolean,
  ): Promise<User>;
  updateUser(userId: string, data: UpdateUserDto): Promise<PublicUser>;
  deleteUser(userId: string): Promise<void>;
}
