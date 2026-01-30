import { User } from '../../../@types';
import { SignUpDto } from '../dtos';

export interface IUserService {
  createUser(data: SignUpDto): Promise<User>;
  validateUserIdentity(idOrEmail: string): Promise<User | null>;
  incrementTokenVersion(userId: string): Promise<number>;
  getProfile(userId: string): Promise<Partial<User>>;
}
