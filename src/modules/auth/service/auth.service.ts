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
  UpdatePasswordDto,
} from '../dtos';
import { USER_SERVICE, type IUserService } from '../../user';
import { type IAuthService } from './auth.service.interface';
import { APP_ERRORS } from '../../../@errors';
import { AppError } from '../../../@errors/app-error';
import { AUTH_REPOSITORY, MFA_SERVICE } from '../tokens';
import { type IMfaService } from './mfa.service.interface';
import { Providers, StringValue, User } from '../../../@types';
import { EMAIL_QUEUE_SERVICE, type IEmailQueueService } from '../../email';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { type IAuthRepository } from '../repository';
import { type IUnitOfWork, UOW_PROVIDER } from '../../unit-of-work';
import { Auth } from '../../../@types/auth';
import { CreateUser } from '../../user/dtos';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
    @Inject(MFA_SERVICE)
    private readonly mfaService: IMfaService,
    @Inject(EMAIL_QUEUE_SERVICE)
    private readonly emailQueueService: IEmailQueueService,
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
    private readonly passwordUtils: PasswordUtils,
    @InjectPinoLogger('AuthService')
    private readonly logger: PinoLogger,
    @Inject(UOW_PROVIDER)
    private readonly uow: IUnitOfWork,
  ) {}

  async createUser(dto: SignUpDto): Promise<User> {
    return await this.uow.execute(async (repos) => {
      const user = await repos.users.create({
        email: dto.email,
        name: dto.name,
      });

      await repos.auth.createAuthData({
        userId: user.id,
        provider: Providers.INTERN,
        passwordHash: await this.passwordUtils.hashPassword(dto.password),
      });

      return user;
    });
  }

  private async createProviderUser(
    data: CreateUser,
    provider: string,
  ): Promise<User> {
    return await this.uow.execute(async (repos) => {
      const providerUser = await repos.users.create({
        email: data.email,
        name: data.name,
      });

      await repos.auth.createAuthData({
        userId: providerUser.id,
        provider,
      });

      return providerUser;
    });
  }

  async googleLogin(googleUser: any) {
    const { email, firstName }: { email: string; firstName: string } =
      googleUser;

    let user = await this.userService.safeFind(email);

    if (!user) {
      user = await this.createProviderUser(
        {
          email,
          name: firstName,
        },
        Providers.GOOGLE,
      );
    }

    const auth = await this.authRepository.findUserAuthData(user.id);

    if (!auth) {
      throw new AppError(APP_ERRORS.INVALID_PROVIDER);
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
      { sub: user.id, tokenVersion: auth.tokenVersion },
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

    const auth = await this.findAuthData(user.id);

    if (!auth.passwordHash) {
      throw new AppError(APP_ERRORS.INVALID_LOGIN_PROVIDER);
    }

    const passwordsMatch = await this.passwordUtils.comparePassword(
      data.password,
      auth.passwordHash,
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
      mfaEnabled: auth.mfaEnabled,
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

    const auth = await this.findAuthData(user.id);

    const { accessToken } = await this.mfaService.validateMfa(
      tempTokenPayload.sub,
      dto.code,
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id, tokenVersion: auth.tokenVersion },
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

    const auth = await this.findAuthData(user.id);

    if (auth.tokenVersion !== tokenVersion) {
      throw new AppError(APP_ERRORS.INVALID_REFRESH_TOKEN);
    }

    const payload: any = {
      sub: user.id,
    };

    // Se existir mfaLastVerifiedAt no banco
    if (auth.mfaLastVerifiedAt) {
      const now = Date.now();
      const mfaAge = now - new Date(auth.mfaLastVerifiedAt).getTime();

      // to-do: mover para env
      const MFA_WINDOW_MS = 24 * 60 * 60 * 1000;

      if (mfaAge <= MFA_WINDOW_MS) {
        // to-do: colocar essa regra em algum canto com nome descritivo
        payload.mfaAuthenticatedAt = Math.floor(
          new Date(auth.mfaLastVerifiedAt).getTime() / 1000,
        );
      }
    }

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN'),
    });

    return {
      accessToken,
    };
  }

  async invalidateRefreshToken(userId: string): Promise<void> {
    await this.authRepository.incrementTokenVersion(userId);
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      const user = await this.userService.findByEmail(email);
      const auth = await this.findAuthData(user.id);

      if (auth.provider !== Providers.INTERN.toString()) {
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

      const redefinePasswordLink = `${this.configService.get('FRONT_RESET_PASSWORD_URL')}?token=${redefinePasswordToken}`;

      await this.emailQueueService.enqueueForgotPasswordEmail({
        user,
        resetLink: redefinePasswordLink,
      });
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

      await this.authRepository.updateAuth(
        user.id,
        {
          passwordHash,
        },
        true,
      );

      await this.emailQueueService.enqueuePasswordChangedEmail({ user });
    } catch {
      throw new AppError(APP_ERRORS.INVALID_CREDENTIALS);
    }
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto): Promise<void> {
    const user = await this.userService.findById(userId);
    const auth = await this.findAuthData(user.id);

    if (auth.provider !== Providers.INTERN.toString() || !auth.passwordHash) {
      throw new AppError(APP_ERRORS.INVALID_PROVIDER);
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new AppError(APP_ERRORS.PASSWORDS_CANNOT_BE_EQUAL);
    }

    const validPass = await this.passwordUtils.comparePassword(
      dto.currentPassword,
      auth.passwordHash,
    );

    if (!validPass) {
      throw new AppError(APP_ERRORS.PASSWORDS_DOES_NOT_MATCH);
    }

    const passwordHash = await this.passwordUtils.hashPassword(dto.newPassword);

    await this.authRepository.updateAuth(
      user.id,
      {
        passwordHash,
      },
      true,
    );

    await this.emailQueueService.enqueuePasswordChangedEmail({ user });
  }

  async requestUpdateEmail(userId: string, email: string): Promise<void> {
    const emailAlreadyExists = await this.userService.safeFind(email);

    if (emailAlreadyExists) {
      throw new AppError(APP_ERRORS.EMAIL_ALREADY_REGISTERED);
    }

    const user = await this.userService.findById(userId);
    const auth = await this.findAuthData(user.id);

    const nowDate = Date.now();

    if (
      auth.emailChangeRequestedAt &&
      nowDate - auth.emailChangeRequestedAt.getTime() < 60_000
    ) {
      throw new AppError(APP_ERRORS.TOO_MANY_REQUESTS);
    }

    // prevent multiple requests, concurrency
    const requestedAt = nowDate;

    // to-do: criar o model de EmailChangeRequest e mudar para la
    await this.authRepository.updateAuth(userId, {
      emailChangeRequestedAt: new Date(requestedAt),
    });

    const expiresIn = String(
      this.configService.get('JWT_CHANGE_EMAIL_EXPIRES_IN'),
    ) as StringValue;

    const token = await this.jwtService.signAsync(
      {
        sub: userId,
        type: 'email-change',
        newEmail: email,
        requestedAt,
      },
      {
        secret: this.configService.get('JWT_CHANGE_EMAIL_SECRET'),
        expiresIn,
      },
    );

    await this.emailQueueService.enqueueChangeEmailRequestEmail({
      user,
      email,
      expiresIn,
      link: `${this.configService.get('FRONT_CHANGE_EMAIL_URL')}?token=${encodeURIComponent(token)}`,
    });
  }

  async confirmUpdateEmail(token: string) {
    const payload = await this.jwtService.verifyAsync<{
      requestedAt: number;
      newEmail: string;
      type: string;
      sub: string;
    }>(token, {
      secret: this.configService.get('JWT_CHANGE_EMAIL_SECRET'),
    });

    if (payload.type !== 'email-change') {
      throw new AppError(APP_ERRORS.INVALID_TOKEN);
    }

    const user = await this.userService.findById(payload.sub);
    const auth = await this.findAuthData(user.id);

    if (!auth.emailChangeRequestedAt) {
      throw new AppError(APP_ERRORS.INVALID_TOKEN);
    }

    if (payload.requestedAt !== auth.emailChangeRequestedAt?.getTime()) {
      throw new AppError(APP_ERRORS.USER_FORBIDDEN);
    }

    const emailAlreadyExists = await this.userService.safeFind(
      payload.newEmail,
    );

    if (emailAlreadyExists) {
      throw new AppError(APP_ERRORS.USER_UNAUTHORIZED);
    }

    const oldEmail = user.email;

    await this.uow.execute(async (repos) => {
      await repos.users.update(payload.sub, { email: payload.newEmail });

      await repos.auth.updateAuth(payload.sub, {
        emailChangeRequestedAt: null,
      });

      await repos.auth.incrementTokenVersion(payload.sub);
    });

    await this.emailQueueService.enqueueNotifyEmailChangedEmail({
      user,
      oldEmail,
      newEmail: payload.newEmail,
    });
  }

  private async findAuthData(userId: string): Promise<Auth> {
    const auth = await this.authRepository.findUserAuthData(userId);

    if (!auth) {
      throw new AppError(APP_ERRORS.USER_NOT_FOUND);
    }

    return auth;
  }
}
