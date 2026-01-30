import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { USER_SERVICE } from '../tokens';
import { type IUserService } from '../service';
import { SignUpDto } from '../dtos';

@Controller('users')
export class UserController {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
  ) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User signed up successfully',
  })
  async signUp(@Body() body: SignUpDto) {
    const data = await this.userService.createUser(body);

    return {
      data,
      status: HttpStatus.CREATED,
    };
  }
}
