import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreatePlanDto,
  ListPlansQueryDto,
  UpdatePlanDto,
} from '../dtos';
import { type IPlanService } from '../service';
import { PLAN_SERVICE } from '../tokens';
import { Public, SkipMfaSession } from '../../auth';

@ApiTags('Plans')
@Public()
@SkipMfaSession()
@Controller('plans')
export class PlanController {
  constructor(
    @Inject(PLAN_SERVICE)
    private readonly planService: IPlanService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The plan has been successfully created.',
  })
  @ApiBody({
    description: 'Data to create a plan',
    type: CreatePlanDto,
  })
  async createPlan(@Body() data: CreatePlanDto) {
    return await this.planService.createPlan(data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all plans',
  })
  async listPlans(@Query() query: ListPlansQueryDto) {
    return await this.planService.listPlans(query);
  }

  @Get(':idOrCode')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a plan by ID or code',
  })
  @ApiParam({
    name: 'idOrCode',
    description: 'ID or code of the plan to retrieve',
    type: String,
  })
  async getPlanByIdOrCode(@Param('idOrCode') idOrCode: string) {
    return await this.planService.getPlanByIdOrCode(idOrCode);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The plan has been successfully updated.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the plan to update',
    type: String,
  })
  @ApiBody({
    description: 'Data to update a plan',
    type: UpdatePlanDto,
  })
  async updatePlan(@Param('id') id: string, @Body() data: UpdatePlanDto) {
    return await this.planService.updatePlan(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The plan has been successfully deleted.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the plan to delete',
    type: String,
  })
  async deletePlan(@Param('id') id: string) {
    return await this.planService.deletePlan(id);
  }
}
