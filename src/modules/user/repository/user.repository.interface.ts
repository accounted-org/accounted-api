import { User } from '../../../@types';
import { CreateUser, UpdateUser } from '../dtos';

export interface IUserRepository {
  create(data: CreateUser): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  find(idOrEmail: string): Promise<User | null>;
  incrementTokenVersion(userId: string): Promise<User | null>;
  update(
    userId: string,
    data: UpdateUser,
    revokeSession?: boolean,
  ): Promise<User | null>;
  delete(userId: string): Promise<User | null>;
}
