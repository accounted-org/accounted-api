import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { SignInRequestDto } from '../dtos';
import { USER_SERVICE, type IUserService } from '../../user';
import { SignInResponseDto } from '../dtos';
import { IAuthService } from './auth.service.interface';
import {APP_ERRORS} from "../../../@errors";
import {AppError} from "../../../@errors/app-error";

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
  ) {}

  async signIn(data: SignInRequestDto): Promise<SignInResponseDto> {
    const user = await this.userService.validateUserIdentity(data.email);

    if (!user) {
      throw new AppError(APP_ERRORS.USER_UNAUTHORIZED);
    }

    const payload = {
      sub: user.id,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN'),
    });

    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id, tokenVersion: user.tokenVersion },
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

  async refresh(userId: string, tokenVersion: number) {
    const user = await this.userService.validateUserIdentity(userId);

    if (!user) {
      throw new AppError(APP_ERRORS.USER_UNAUTHORIZED);
    }

    if (user.tokenVersion !== tokenVersion) {
      throw new AppError(APP_ERRORS.INVALID_REFRESH_TOKEN);
    }

    const accessToken = await this.jwtService.signAsync(
      { sub: user.id },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES_IN'),
      },
    );

    return {
      accessToken,
    };
  }

  async invalidateRefreshToken(userId: string): Promise<void> {
    await this.userService.incrementTokenVersion(userId);
  }
}
