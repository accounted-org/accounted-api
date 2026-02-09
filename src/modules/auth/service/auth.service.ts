import { PasswordUtils } from './../../utils/password.utils';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import {
  SignInStepOneRequestDto,
  SignInStepOneResponseDto,
  SignInStepTwoRequestDto,
  SignInStepTwoResponseDto,
  SignUpDto,
} from '../dtos';
import { USER_SERVICE, type IUserService } from '../../user';
import { type IAuthService } from './auth.service.interface';
import { APP_ERRORS } from '../../../@errors';
import { AppError } from '../../../@errors/app-error';
import { MFA_SERVICE } from '../tokens';
import { type IMfaService } from './mfa.service.interface';
import { Lang, Providers, User } from '../../../@types';
import { EMAIL_SERVICE, type IEmailService } from '../../email';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
    @Inject(MFA_SERVICE)
    private readonly mfaService: IMfaService,
    @Inject(EMAIL_SERVICE)
    private readonly emaillService: IEmailService,
    private readonly passwordUtils: PasswordUtils,
    @InjectPinoLogger('AuthService') private readonly logger: PinoLogger,
  ) {}

  async createUser(dto: SignUpDto): Promise<User> {
    return await this.userService.createUser(dto);
  }

  async googleLogin(googleUser: any) {
    const { email }: { email: string } = googleUser;

    let user = await this.userService.findByEmail(email).catch(console.log);

    if (!user) {
      user = await this.userService.createProviderUser({
        email: googleUser.email,
        name: googleUser.firstName,
        provider: Providers.GOOGLE,
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

    if (!user.passwordHash) {
      throw new AppError(APP_ERRORS.INVALID_LOGIN_PROVIDER);
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

  async forgotPassword(email: string): Promise<void> {
    try {
      const user = await this.userService.findByEmail(email);

      if (user.provider !== Providers.INTERN.toString()) {
        this.logger.info('[forgotPassword]: User provider not allowed');

        return;
      }

      this.logger.info('[forgotPassword]: Recovery link sent');

      const redefinePasswordToken = await this.jwtService.signAsync(
        {
          sub: user.id,
          // colocar em algum canto pra nao ficar magic string
          type: 'password-reset',
        },
        {
          secret: this.configService.get('JWT_RESET_SECRET'),
          expiresIn: this.configService.get('JWT_RESET_EXPIRES_IN'),
        },
      );

      const redefinePasswordLink = `${this.configService.get('FRONT_RESET_PASSWORD_URL'.replace('<lang>', user.preferredLanguage ?? Lang.PT_BR))}?token=${redefinePasswordToken}`;

      await this.emaillService.sendForgotPasswordEmail(
        user,
        redefinePasswordLink,
      );
    } catch {
      this.logger.info(
        `[forgotPassword]: User with email '${email}' not found`,
      );
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const tokenPayload: { sub: string; type: string } =
        await this.jwtService.verifyAsync(token, {
          secret: this.configService.get('JWT_RESET_SECRET'),
        });

      if (!tokenPayload || tokenPayload.type !== 'password-reset') {
        throw new AppError(APP_ERRORS.INVALID_CREDENTIALS);
      }

      const user = await this.userService.findById(tokenPayload.sub);

      if (!user) {
        throw new AppError(APP_ERRORS.INVALID_CREDENTIALS);
      }

      const passwordHash = await this.passwordUtils.hashPassword(newPassword);

      await this.userService.updateUserIntern(user.id, {
        passwordHash,
      });
    } catch {
      throw new AppError(APP_ERRORS.INVALID_CREDENTIALS);
    }
  }
}
