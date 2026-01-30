import { User } from '@types';
import { SignUpDto } from '../dtos';

export interface IUserService {
  createUser(data: SignUpDto): Promise<User>;
  validateUserIdentity(email: string): Promise<User | null>;
}
