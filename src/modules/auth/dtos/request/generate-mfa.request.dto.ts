import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GenerateMfaRequestDto {
  @ApiProperty({
    description: 'JWT Token to validate MFA flow in step two',
  })
  @IsString()
  tempToken: string;
}
