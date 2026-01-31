import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PasswordUtils } from '../../utils';
import { USER_REPOSITORY } from '../tokens';
import type { IUserRepository } from '../repository';
import { SignUpDto } from '../dtos';
import { IUserService } from './user.service.interface';
import { User } from '../../../@types';
import { UserBuilder } from '../user.builder';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly passwordUtils: PasswordUtils,
    private readonly userBuilder: UserBuilder,
  ) {}

  async validateUserIdentity(idOrEmail: string): Promise<User | null> {
    return await this.userRepository.find(idOrEmail);
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

  async incrementTokenVersion(userId: string): Promise<number> {
    const user = await this.userRepository.incrementTokenVersion(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.tokenVersion;
  }

  async getProfile(userId: string): Promise<Partial<User>> {
    const user = await this.userRepository.find(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userBuilder.publicUser(user);
  }
}
