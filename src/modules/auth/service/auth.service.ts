import { PasswordUtils } from './../../utils/password.utils';
import { Injectable } from '@nestjs/common';
import { SignInDto, SignUpDto } from '../dtos';
import { JwtService } from '@nestjs/jwt';
import { User } from '@types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly passwordUtils: PasswordUtils,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signIn(data: SignInDto) {
    const user = {
      id: 'user-id-123',
      email: data.email,
    };

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN'),
    });

    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async signUp(data: SignUpDto) {
    return {
      hash: await this.passwordUtils.hashPassword(data.password),
    };
  }

  refresh(user: User) {
    return {
      token: this.jwtService.sign({ email: user.email }),
    };
  }
}
