import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class SignInStepTwoRequestDto {
  @ApiProperty({
    description: 'JWT Token to validate MFA flow in step two',
  })
  @IsString()
  tempToken: string;

  @ApiProperty({
    description: 'Code generate by authenticator app',
  })
  @MinLength(6)
  @IsString()
  code: string;
}
