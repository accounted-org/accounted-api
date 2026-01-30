import { Injectable } from '@nestjs/common';
import { User } from '../../@types';

@Injectable()
export class UserBuilder {
  publicUser(user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
