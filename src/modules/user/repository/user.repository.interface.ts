import { User } from '@types';
import { CreateUser } from '../dtos';

export interface IUserRepository {
  create(data: CreateUser): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}
