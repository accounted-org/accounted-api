import { AuthService } from './../service/auth.service';
import { Controller, HttpStatus, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signin')
  signIn() {
    const data = this.authService.signIn();

    return {
      data,
      status: HttpStatus.OK,
    };
  }
}
