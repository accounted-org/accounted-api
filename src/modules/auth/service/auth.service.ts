import { PasswordUtils } from './../../utils/password.utils';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import {
  SignInStepOneRequestDto,
  SignInStepOneResponseDto,
  SignInStepTwoRequestDto,
  SignInStepTwoResponseDto,
} from '../dtos';
import { USER_SERVICE, type IUserService } from '../../user';
import { type IAuthService } from './auth.service.interface';
import { APP_ERRORS } from '../../../@errors';
import { AppError } from '../../../@errors/app-error';
import { MFA_SERVICE } from '../tokens';
import { type IMfaService } from './mfa.service.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
    @Inject(MFA_SERVICE)
    private readonly mfaService: IMfaService,
    private readonly passwordUtils: PasswordUtils,
  ) {}

  async googleLogin(googleUser: any) {
    const { email }: { email: string } = googleUser;

    let user = await this.userService.findByEmail(email).catch(console.log);

    if (!user) {
      user = await this.userService.createUser({
        email: googleUser.email,
        name: googleUser.firstName,
        password: '',
      });
    }

    const payload = {
      sub: user.id,
      email: user.email,
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

  async signInStepOne(
    data: SignInStepOneRequestDto,
  ): Promise<SignInStepOneResponseDto> {
    const user = await this.userService.validateUserIdentity(data.email);

    if (!user) {
      throw new AppError(APP_ERRORS.USER_UNAUTHORIZED);
    }

    const passwordsMatch = await this.passwordUtils.comparePassword(
      data.password,
      user.passwordHash,
    );

    if (!passwordsMatch) {
      throw new AppError(APP_ERRORS.USER_UNAUTHORIZED);
    }

    const tempToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        mfaPending: true,
      },
      { expiresIn: '5m' },
    );

    return {
      mfaEnabled: user.mfaEnabled,
      tempToken,
    };
  }

  async signInStepTwo(
    dto: SignInStepTwoRequestDto,
  ): Promise<SignInStepTwoResponseDto> {
    const tempTokenPayload: { sub: string; mfaPending: boolean } =
      await this.jwtService.verifyAsync(dto.tempToken);

    if (!tempTokenPayload || !tempTokenPayload.mfaPending) {
      throw new AppError(APP_ERRORS.USER_UNAUTHORIZED);
    }

    const user = await this.userService.validateUserIdentity(
      tempTokenPayload.sub,
    );

    if (!user) {
      throw new AppError(APP_ERRORS.USER_UNAUTHORIZED);
    }

    await this.mfaService.validateMfa(tempTokenPayload.sub, dto.code);

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
