import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Patch,
  Req,
} from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { USER_SERVICE } from '../tokens';
import { type IUserService } from '../service';
import type { Request } from '../../../@types';
import { UpdateUserDto } from '../dtos';

@Controller('users')
export class UserController {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
  ) {}

  @Get('/profile')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns user logged data',
  })
  async getProfile(@Req() req: Request) {
    return await this.userService.getProfile(req.user?.sub);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update data of a user',
  })
  @ApiBody({
    description: 'Data to update of the user',
    type: UpdateUserDto,
  })
  async updateUser(@Req() req: Request, @Body() body: UpdateUserDto) {
    return await this.userService.updateUser(req.user.sub, body);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Delete user account',
  })
  async deleteUser(@Req() req: Request) {
    return await this.userService.deleteUser(req.user.sub);
  }
}
