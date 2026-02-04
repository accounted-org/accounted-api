import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignInStepOneResponseDto {
  @ApiProperty({
    description: 'Flag requiring MFA flow',
  })
  @IsString()
  mfaEnabled: boolean;

  @ApiProperty({
    description: 'JWT Token to validate MFA flow in step two',
  })
  @IsString()
  tempToken: string;
}
