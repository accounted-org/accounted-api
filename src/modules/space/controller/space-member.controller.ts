import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { SPACE_MEMBER_SERVICE } from '../tokens';
import { type ISpaceMemberService } from '../service';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { type Request } from '../../../@types';
import { AddSpaceMemberDto } from '../dtos';

@ApiTags('Space Members')
@Controller('spaces/:spaceId/members')
export class SpaceMemberController {
  constructor(
    @Inject(SPACE_MEMBER_SERVICE)
    private readonly spaceMemberService: ISpaceMemberService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a list of members of the space',
  })
  @ApiParam({
    name: 'spaceId',
    description: 'ID of the space to list members',
    type: String,
  })
  async listMembers(@Param('spaceId') spaceId: string) {
    return await this.spaceMemberService.listSpaceMembers(spaceId);
  }

  @Get(':memberId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the member data',
  })
  @ApiParam({
    name: 'spaceId',
    description: 'ID of the space',
    type: String,
  })
  @ApiParam({
    name: 'memberId',
    description: 'ID of the member to retrieve',
    type: String,
  })
  async getMember(
    @Param('spaceId') spaceId: string,
    @Param('memberId') memberId: string,
  ) {
    return await this.spaceMemberService.getSpaceMember(spaceId, memberId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Adds a member to the space',
  })
  @ApiParam({
    name: 'spaceId',
    description: 'ID of the space to add a member',
    type: String,
  })
  @ApiParam({
    name: 'memberId',
    description: 'ID of the member to add to the space',
    type: String,
  })
  async addMember(
    @Param('spaceId') spaceId: string,
    @Body() dto: AddSpaceMemberDto,
    @Req() req: Request,
  ) {
    return await this.spaceMemberService.addSpaceMember(
      req.user.sub,
      spaceId,
      dto.memberId,
    );
  }

  @Delete(':memberId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Removes a member from the space',
  })
  @ApiParam({
    name: 'spaceId',
    description: 'ID of the space to remove a member',
    type: String,
  })
  @ApiParam({
    name: 'memberId',
    description: 'ID of the member to remove from the space',
    type: String,
  })
  async removeMember(
    @Param('spaceId') spaceId: string,
    @Param('memberId') memberId: string,
    @Req() req: Request,
  ) {
    await this.spaceMemberService.removeSpaceMember(
      req.user.sub,
      spaceId,
      memberId,
    );
  }
}
