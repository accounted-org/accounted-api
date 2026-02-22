import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { IMfaService } from './mfa.service.interface';

import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { USER_SERVICE, type IUserService } from '../../user';
import { MfaData, ValidateMfa } from '../dtos';
import { JwtService } from '@nestjs/jwt';
import { AppError } from '../../../@errors/app-error';
import { APP_ERRORS } from '../../../@errors';
import { AUTH_REPOSITORY } from '../tokens';
import { type IAuthRepository } from '../repository';

@Injectable()
export class MfaService implements IMfaService {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateMfa(tempToken: string): Promise<MfaData> {
    const tempTokenPayload: { sub: string; mfaPending: boolean } =
      await this.jwtService.verifyAsync(tempToken);

    if (!tempTokenPayload || !tempTokenPayload.mfaPending) {
      throw new AppError(APP_ERRORS.INVALID_CREDENTIALS);
    }

    const user = await this.userService.findById(tempTokenPayload.sub);
    const auth = await this.authRepository.findUserAuthData(user.id);

    if (auth?.mfaEnabled) {
      throw new AppError(APP_ERRORS.MFA_ALREADY_ENABLED);
    }

    const secret = speakeasy.generateSecret({
      name: `Accounted (${user.email})`,
      length: 32,
    });

    await this.authRepository.updateAuth(user.id, {
      mfaSecret: secret.base32,
    });

    if (!secret.otpauth_url) {
      throw new AppError(APP_ERRORS.INTERNAL_SERVER_ERROR);
    }

    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    return {
      qrCode,
      manualCode: secret.base32,
    };
  }

  /**
   * Enable flow - must be called once the user has registered the MFA data in their authenticator app and is ready to activate MFA in their account
   * @param userId logged user id
   * @param code app generated token
   * @returns success
   */
  async verifyMfa(
    tempToken: string,
    code: string,
    isActivating = false,
  ): Promise<ValidateMfa> {
    const tempTokenPayload: { sub: string; mfaPending: boolean } =
      await this.jwtService.verifyAsync(tempToken);

    if (!tempTokenPayload || !tempTokenPayload.mfaPending) {
      throw new AppError(APP_ERRORS.INVALID_CREDENTIALS);
    }

    const { sub: userId } = tempTokenPayload;

    await this.validateMfaFlow(userId, code, isActivating);

    const mfaLastVerifiedAt = new Date();

    await this.authRepository.updateAuth(userId, {
      mfaLastVerifiedAt,
      ...(isActivating ? { mfaEnabled: true } : {}),
    });

    const payload = {
      sub: userId,
      // to-do: colocar essa regra em algum canto com nome descritivo
      mfaAuthenticatedAt: Math.floor(mfaLastVerifiedAt.getTime() / 1000),
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN'),
    });

    return {
      success: true,
      mfaLastVerifiedAt,
      accessToken,
    };
  }

  async revalidateMfa(userId: string, code: string): Promise<boolean> {
    return await this.validateMfaFlow(userId, code);
  }

  private async validateMfaFlow(
    userId: string,
    code: string,
    isActivating = false,
  ): Promise<boolean> {
    const auth = await this.authRepository.findUserAuthData(userId);

    if (!isActivating && !auth?.mfaEnabled) {
      throw new AppError(APP_ERRORS.MFA_NOT_ENABLED);
    }

    if (isActivating && auth?.mfaEnabled) {
      throw new AppError(APP_ERRORS.MFA_ALREADY_ENABLED);
    }

    if (!auth?.mfaSecret) {
      throw new AppError(APP_ERRORS.MFA_NOT_ENABLED);
    }

    const isValidCode = this.verifyCode(auth.mfaSecret, code);

    if (!isValidCode) {
      throw new AppError(APP_ERRORS.MFA_INVALID_CODE);
    }

    return true;
  }

  private verifyCode(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 1, // tolerância de 30s antes/depois
    });
  }
}
