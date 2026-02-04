import { User } from '../../../@types';
import { CreateUser, SignUpDto, UpdateUser } from '../dtos';

export interface IUserService {
  createUser(data: SignUpDto): Promise<User>;
  createProviderUser(data: CreateUser): Promise<User>;
  validateUserIdentity(idOrEmail: string): Promise<User | null>;
  incrementTokenVersion(userId: string): Promise<number>;
  getProfile(userId: string): Promise<Partial<User>>;
  findById(userId: string): Promise<User>;
  findByEmail(userId: string): Promise<User>;
  updateUser(userId: string, data: UpdateUser): Promise<User>;
}
