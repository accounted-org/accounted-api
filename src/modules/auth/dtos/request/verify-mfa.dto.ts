import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class VerifyMfaDto {
  @ApiProperty({
    description: 'JWT Token to validate MFA flow in step two',
  })
  @IsString()
  tempToken: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({
    description: 'Code generate by authenticator app',
  })
  code: string;
}
