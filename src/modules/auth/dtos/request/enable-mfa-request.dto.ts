import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EnableMfaRequestDto {
  @ApiProperty({
    description: 'JWT Token to validate MFA flow in step two',
  })
  @IsString()
  tempToken: string;

  @ApiProperty({
    description: 'Code generate by authenticator app',
  })
  @IsString()
  code: string;
}
