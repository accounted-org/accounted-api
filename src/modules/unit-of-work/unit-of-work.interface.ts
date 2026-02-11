import { IAuthRepository } from '../auth/repository';
import { IUserRepository } from '../user/repository';

export interface IRepositories {
  users: IUserRepository;
  auth: IAuthRepository;
  // to-do: add new module emailChangeRequests: EmailChangeRequestRepository;
  // to-do: add new module securityEvents: SecurityEventRepository;
}

export interface IUnitOfWork {
  execute<T>(work: (repositories: IRepositories) => Promise<T>): Promise<T>;
}
