import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class VerifyMfaDto {
  @IsString()
  @MinLength(6)
  @ApiProperty({
    description: 'Code generate by authenticator app',
  })
  code: string;
}
