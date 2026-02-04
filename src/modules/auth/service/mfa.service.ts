import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { IMfaService } from './mfa.service.interface';

import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { USER_SERVICE, type IUserService } from '../../user';
import { MfaData } from '../dtos';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MfaService implements IMfaService {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
    private readonly jwtService: JwtService,
  ) {}

  async generateMfa(tempToken: string): Promise<MfaData> {
    const tempTokenPayload: { sub: string; mfaPending: boolean } =
      await this.jwtService.verifyAsync(tempToken);

    if (!tempTokenPayload || !tempTokenPayload.mfaPending) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.userService.findById(tempTokenPayload.sub);

    if (user.mfaEnabled) {
      throw new BadRequestException('MFA already enabled');
    }

    const secret = speakeasy.generateSecret({
      name: `Accounted (${user.email})`,
      length: 32,
    });

    await this.userService.updateUser(user.id, {
      mfaSecret: secret.base32,
    });

    if (!secret.otpauth_url) {
      throw new InternalServerErrorException('Internal server error');
    }

    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    return {
      qrCode,
      manualCode: secret.base32,
    };
  }

  async enableMfa(tempToken: string, code: string): Promise<boolean> {
    const tempTokenPayload: { sub: string; mfaPending: boolean } =
      await this.jwtService.verifyAsync(tempToken);

    if (!tempTokenPayload || !tempTokenPayload.mfaPending) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.userService.findById(tempTokenPayload.sub);

    if (!user.mfaSecret) {
      throw new BadRequestException('MFA not initialized');
    }

    if (user.mfaEnabled) {
      throw new BadRequestException('MFA already enabled');
    }

    const isValid = this.verifyCode(user.mfaSecret, code);

    if (!isValid) {
      throw new UnauthorizedException('Invalid code');
    }

    await this.userService.updateUser(user.id, {
      mfaEnabled: true,
    });

    return true;
  }

  /**
   * Login flow
   * @param userId logged user id
   * @param code app generated token
   * @returns success
   */
  async validateMfa(userId: string, code: string): Promise<boolean> {
    const user = await this.userService.findById(userId);

    if (!user.mfaEnabled || !user.mfaSecret) {
      throw new UnauthorizedException('MFA pending');
    }

    const isValid = this.verifyCode(user.mfaSecret, code);

    if (!isValid) {
      throw new UnauthorizedException('Invalid code');
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
