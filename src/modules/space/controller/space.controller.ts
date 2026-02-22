import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { CreateSpaceDto, UpdateSpaceDto } from '../dtos';
import { type ISpaceService } from '../service';
import { SPACE_SERVICE } from '../tokens';
import { type Request } from '../../../@types';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Spaces')
@Controller('spaces')
export class SpaceController {
  constructor(
    @Inject(SPACE_SERVICE)
    private readonly spaceService: ISpaceService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The space has been successfully created.',
  })
  @ApiBody({
    description: 'Data to create a new space',
    type: CreateSpaceDto,
  })
  async createSpace(@Body() data: CreateSpaceDto, @Req() req: Request) {
    return await this.spaceService.createSpace(req.user.sub, data);
  }

  @Get('personal')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the personal space of the authenticated user',
  })
  async getMyPersonalSpace(@Req() req: Request) {
    return await this.spaceService.getMyPersonalSpace(req.user.sub);
  }

  @Get(':spaceId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the space data',
  })
  @ApiParam({
    name: 'spaceId',
    description: 'ID of the space to retrieve',
    type: String,
  })
  async getSpace(@Req() req: Request, @Param('spaceId') spaceId: string) {
    return await this.spaceService.getSpace(req.user.sub, spaceId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a list of spaces the authenticated user belongs to',
  })
  async listMySpaces(@Req() req: Request) {
    return await this.spaceService.listMySpaces(req.user.sub);
  }

  @Patch(':spaceId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The space has been successfully updated.',
  })
  async updateSpace(
    @Req() req: Request,
    @Param('spaceId') spaceId: string,
    @Body() data: UpdateSpaceDto,
  ) {
    return await this.spaceService.updateSpace(req.user.sub, spaceId, data);
  }
}
