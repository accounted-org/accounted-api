import { ConfigService } from '@nestjs/config';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { type Response } from 'express';
import type { RefreshRequest, Request } from '../../../@types';

import { JwtRefreshGuard } from '../guards/jwt-refresh-auth.guard';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  SignInStepOneRequestDto,
  SignInStepTwoRequestDto,
} from '../dtos';

import { GuestGuard, Public } from '../../../common';
import { type IAuthService } from '../service';
import { AUTH_SERVICE } from '../tokens';
import { GoogleAuthGuard } from '../guards/google-auth.guard';
import { SignUpDto } from '../../user/dtos';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: IAuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User signed up successfully',
  })
  async signUp(@Body() body: SignUpDto) {
    await this.authService.createUser(body);
  }

  @Public()
  @UseGuards(GuestGuard)
  @Post('/signin/step-one')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'User signed in successfully. Returns temporary token to validate MFA on step two',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async signInStepOne(@Body() body: SignInStepOneRequestDto) {
    const data = await this.authService.signInStepOne(body);

    return data;
  }

  @Public()
  @UseGuards(GuestGuard)
  @Post('/signin/step-two')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User signed in successfully. Returns access token',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async signInStepTwo(
    @Body() body: SignInStepTwoRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.signInStepTwo(body);

    const isProd = this.configService.get('NODE_ENV') === 'production';
    const cookieDomain = this.configService.get('COOKIE_DOMAIN');
    const path = `/${String(this.configService.get('BASE_URL'))}/auth/refresh`;

    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path, // important
      domain: cookieDomain,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    });

    return {
      data: {
        accessToken: data.accessToken,
      },
    };
  }

  @Post('/signout')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User signed ou successfully',
  })
  async signOut(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const isProd = this.configService.get('NODE_ENV') === 'production';
    const cookieDomain = this.configService.get('COOKIE_DOMAIN');
    const path = `/${String(this.configService.get('BASE_URL'))}/auth/refresh`;

    await this.authService.invalidateRefreshToken(req.user.sub);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path, // important
      domain: cookieDomain,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    });
  }

  @Public()
  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(@Req() req: RefreshRequest) {
    const data = await this.authService.refresh(
      req.user.sub,
      req.user.tokenVersion,
    );

    return {
      data,
    };
  }

  @Public()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // só redireciona para o Google
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.googleLogin(req.user);

    const isProd = this.configService.get('NODE_ENV') === 'production';
    const cookieDomain = this.configService.get('COOKIE_DOMAIN');
    const path = `/${String(this.configService.get('BASE_URL'))}/auth/refresh`;

    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path, // important
      domain: cookieDomain,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    });

    return {
      data: {
        accessToken: data.accessToken,
      },
    };
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassowrd(@Body() dto: ForgotPasswordDto) {
    void this.authService.forgotPassword(dto.email);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.token, dto.newPassword);
  }
}
