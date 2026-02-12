import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { Lang } from '../../../../@types';

export class SignUpDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user to sign up',
  })
  @IsString()
  @MinLength(2)
  name: string;

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

  @IsOptional()
  @IsEnum(Lang)
  preferredLanguage?: Lang;
}
