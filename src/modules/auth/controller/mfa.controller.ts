import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GuestGuard, Public } from '../../../common';
import { ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { EnableMfaRequestDto, GenerateMfaRequestDto } from '../dtos';
import { MFA_SERVICE } from '../tokens';
import { type IMfaService } from '../service';

@Controller('mfa')
export class MfaController {
  constructor(
    @Inject(MFA_SERVICE)
    private readonly mfaService: IMfaService,
  ) {}

  @Public()
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
}
