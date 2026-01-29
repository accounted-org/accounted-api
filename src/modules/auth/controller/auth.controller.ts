import { ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './../service/auth.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignInDto, SignUpDto } from '../dtos';

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
  signIn(@Body() body: SignInDto) {
    const data = this.authService.signIn(body);
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
}
