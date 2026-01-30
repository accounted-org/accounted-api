import { ConfigService } from '@nestjs/config';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { type Response, type Request } from 'express';

import { JwtRefreshGuard } from '../guards/jwt-refresh-auth.guard';
import { AuthService } from './../service/auth.service';
import { SignInDto } from '../dtos';

import { Public } from 'common';
import { User } from '@types';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User signed in successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async signIn(@Body() body: SignInDto, @Res() res: Response) {
    const data = await this.authService.signIn(body);

    const isProd = this.configService.get('NODE_ENV') === 'production';
    const cookieDomain = this.configService.get('COOKIE_DOMAIN');

    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/auth/refresh', // important
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
  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(@Req() req: Request & { user: User }) {
    const accessToken = await this.authService.refresh(req.user);

    return {
      data: {
        accessToken,
      },
    };
  }
}
