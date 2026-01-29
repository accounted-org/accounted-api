import { PasswordUtils } from './../../utils/password.utils';
import { Injectable } from '@nestjs/common';
import { SignInDto, SignUpDto } from '../dtos';

@Injectable()
export class AuthService {
  constructor(private readonly passwordUtils: PasswordUtils) {}

  signIn(data: SignInDto) {
    return {
      token: '123456',
      data,
    };
  }

  async signUp(data: SignUpDto) {
    return {
      hash: await this.passwordUtils.hashPassword(data.password),
    };
  }
}
