import { Inject, Injectable } from '@nestjs/common';
import { PasswordUtils } from '../../utils';
import { USER_REPOSITORY } from '../tokens';
import type { IUserRepository } from '../repository';
import { CreateUser, UpdateUserDto } from '../dtos';
import { IUserService } from './user.service.interface';
import { PublicUser, User } from '../../../@types';
import { UserBuilder } from '../user.builder';
import { AppError } from '../../../@errors/app-error';
import { APP_ERRORS } from '../../../@errors';

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

  async createProviderUser(data: CreateUser) {
    const userAlreadyExists = await this.userRepository.findByEmail(data.email);

    if (userAlreadyExists) {
      throw new AppError(APP_ERRORS.EMAIL_ALREADY_REGISTERED);
    }

    return await this.userRepository.create({
      email: data.email,
      name: data.name,
      provider: data.provider,
    });
  }

  async getProfile(userId: string): Promise<Partial<User>> {
    const user = await this.findById(userId);

    return this.userBuilder.publicUser(user);
  }

  async findById(userId: string): Promise<User> {
    const user = await this.userRepository.find(userId);

    if (!user) {
      throw new AppError(APP_ERRORS.USER_NOT_FOUND);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.find(email);

    if (!user) {
      throw new AppError(APP_ERRORS.USER_NOT_FOUND);
    }

    return user;
  }

  async safeFind(idOrEmail: string) {
    const user = await this.userRepository.find(idOrEmail);

    if (!user) {
      return null;
    }

    return user;
  }

  async updateUser(userId: string, data: UpdateUserDto): Promise<PublicUser> {
    await this.findById(userId);

    const updatedUser = await this.userRepository.update(userId, data);

    return this.userBuilder.publicUser(updatedUser);
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await this.findById(userId);

    await this.userRepository.delete(user.id);
  }
}
