import { UpdateAuth } from '../dtos';
import { IAuthRepository } from './auth.repository.interface';

export class PrismaAuthPersistenceAdapter implements IAuthRepository {
  async updateAuth(data: UpdateAuth): Promise<void> {}
}
