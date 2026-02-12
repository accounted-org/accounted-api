import { IAuthRepository } from '../../auth/repository';
import { ISecurityEventRepository } from '../../security-event';
import { IUserRepository } from '../../user/repository';

export interface IRepositories {
  users: IUserRepository;
  auth: IAuthRepository;
  securityEvents: ISecurityEventRepository;
}

export interface IUnitOfWork {
  execute<T>(work: (repositories: IRepositories) => Promise<T>): Promise<T>;
}
