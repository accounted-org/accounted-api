import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user to sign up',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StrongPass123!',
    description: 'The password of the user to sign up',
  })
  @IsStrongPassword({ minLength: 8 })
  password: string;
}
