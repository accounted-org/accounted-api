import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @ApiProperty({
    description: 'Current user password',
  })
  currentPassword: string;

  @ApiProperty({
    example: 'StrongPass123!',
    description: 'The password of the user to sign up',
  })
  @IsStrongPassword({ minLength: 8 })
  newPassword: string;
}
