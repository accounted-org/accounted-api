import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import {
  EnableMfaRequestDto,
  GenerateMfaRequestDto,
  VerifyMfaDto,
} from '../dtos';
import { MFA_SERVICE } from '../tokens';
import { type IMfaService } from '../service';
import { type Request } from '../../../@types';
import { Public, SkipMfaSession } from '../decorators';
import { GuestGuard } from '../guards';

@Controller('mfa')
export class MfaController {
  constructor(
    @Inject(MFA_SERVICE)
    private readonly mfaService: IMfaService,
  ) {}

  @Public()
  @SkipMfaSession()
  @UseGuards(GuestGuard)
  @Post('generate')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns MFA data to registry in authenticator apps',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async generateMfa(@Body() body: GenerateMfaRequestDto) {
    const mfaData = await this.mfaService.generateMfa(body.tempToken);

    return {
      data: mfaData,
    };
  }

  @Public()
  @SkipMfaSession()
  @UseGuards(GuestGuard)
  @Post('enable')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns MFA data to registry in authenticator apps',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async enableMfa(@Body() body: EnableMfaRequestDto) {
    return await this.mfaService.enableMfa(body.tempToken, body.code);
  }

  @SkipMfaSession()
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success validating code',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid code' })
  async validateMfa(@Req() req: Request, @Body() dto: VerifyMfaDto) {
    return await this.mfaService.validateMfa(req.user.sub, dto.code);
  }
}
