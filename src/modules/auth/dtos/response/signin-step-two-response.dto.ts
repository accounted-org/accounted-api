import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignInStepTwoResponseDto {
  @ApiProperty({
    description: 'Access token with 15m of expiration',
  })
  @IsString()
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token with 7d of expiration',
  })
  @IsString()
  refreshToken: string;
}
