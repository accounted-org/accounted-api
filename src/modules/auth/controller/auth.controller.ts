import { ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './../service/auth.service';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SignInDto, SignUpDto } from '../dtos';
import { Public } from 'common';
import { JwtRefreshGuard } from '../guards/jwt-refresh-auth.guard';
import { type Request } from 'express';
import { User } from '@types';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User signed in successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async signIn(@Body() body: SignInDto) {
    const data = await this.authService.signIn(body);
    return {
      data,
      status: HttpStatus.OK,
    };
  }

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User signed up successfully',
  })
  async signUp(@Body() body: SignUpDto) {
    const data = await this.authService.signUp(body);

    return {
      data,
      status: HttpStatus.CREATED,
    };
  }

  @Public()
  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  refresh(@Req() req: Request & { user: User }) {
    return this.authService.refresh(req.user);
  }
}
