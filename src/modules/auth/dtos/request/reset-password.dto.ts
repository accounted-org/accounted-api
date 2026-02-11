import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Token received in email to redefine password. Short live',
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'New user password',
  })
  @IsString()
  newPassword: string;
}
