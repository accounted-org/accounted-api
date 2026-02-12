import { Auth } from '../../../@types/auth';
import { CreateAuth, UpdateAuth } from '../dtos';

export interface IAuthRepository {
  updateAuth(
    userid: string,
    data: UpdateAuth,
    revokeSession?: boolean,
  ): Promise<Auth>;
  findUserAuthData(userId: string): Promise<Auth | null>;
  createAuthData(data: CreateAuth): Promise<Auth>;
  incrementTokenVersion(userId: string): Promise<Auth | null>;
}
