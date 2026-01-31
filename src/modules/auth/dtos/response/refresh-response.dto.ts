import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshResponseDto {
  @ApiProperty({ description: 'New access token' })
  @IsString()
  accessToken: string;
}
