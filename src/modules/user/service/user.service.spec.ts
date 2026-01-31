import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { IUserRepository } from '../repository/user.repository.interface';
import { USER_REPOSITORY } from '../tokens';
import { UserBuilder } from '../user.builder';
import { UtilsModule } from '../../utils';
import { User } from '../../../@types';

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<IUserRepository>;

  beforeEach(async () => {
    const mockRepository: jest.Mocked<IUserRepository> = {
      find: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      incrementTokenVersion: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [UtilsModule],
      providers: [
        UserBuilder,
        UserService,
        {
          provide: USER_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get(UserService);
    repository = module.get(USER_REPOSITORY);
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      const user = { id: '1', email: 'test@test.com' };

      repository.find.mockResolvedValue(user as any);

      const result = await service.getProfile('1');

      expect(result).toEqual(user);
    });
  });
});
