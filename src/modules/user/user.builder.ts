import { Injectable } from '@nestjs/common';
import { PublicUser, User } from '../../@types';

@Injectable()
export class UserBuilder {
  publicUser(user: User): PublicUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      preferredLanguage: user.preferredLanguage,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
