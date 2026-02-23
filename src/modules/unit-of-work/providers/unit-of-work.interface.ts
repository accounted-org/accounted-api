import { IAuthRepository } from '../../auth/repository';
import { ISecurityEventRepository } from '../../security-event';
import {
  ISpaceMemberRepository,
  ISpaceRepository,
} from '../../space/repository';
import { IUserRepository } from '../../user/repository';

export interface IRepositories {
  users: IUserRepository;
  auth: IAuthRepository;
  securityEvents: ISecurityEventRepository;
  space: ISpaceRepository;
  spaceMember: ISpaceMemberRepository;
}

export interface IUnitOfWork {
  execute<T>(work: (repositories: IRepositories) => Promise<T>): Promise<T>;
}
