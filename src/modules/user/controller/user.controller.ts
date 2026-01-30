import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { USER_SERVICE } from '../tokens';
import { type IUserService } from '../service';
import { SignUpDto } from '../dtos';
import type { Request } from '@types';

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
    await this.userService.createUser(body);
  }

  @Get('/profile')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns user logged data',
  })
  async getProfile(@Req() req: Request) {
    return await this.userService.getProfile(req.user.sub);
  }
}
