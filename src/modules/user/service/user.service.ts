import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PasswordUtils } from '../../utils';
import { USER_REPOSITORY } from '../tokens';
import type { IUserRepository } from '../repository';
import { SignUpDto } from '../dtos';
import { IUserService } from './user.service.interface';
import { User } from '@types';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly passwordUtils: PasswordUtils,
  ) {}

  async validateUserIdentity(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async createUser(data: SignUpDto) {
    const userAlreadyExists = await this.userRepository.findByEmail(data.email);

    if (userAlreadyExists) {
      throw new BadRequestException('User already exists');
    }

    const user = await this.userRepository.create({
      email: data.email,
      name: data.name,
      passwordHash: await this.passwordUtils.hashPassword(data.password),
    });

    return user;
  }
}
