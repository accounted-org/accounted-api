import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signIn() {
    return {
      token: '123456',
    };
  }
}
