import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Lang } from '../../../../@types';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The new name of the user',
    required: false,
  })
  @IsString()
  @MinLength(3)
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'en',
    description: 'The new preferred language of the user',
    enum: Lang,
    required: false,
  })
  @IsString()
  @IsEnum(Lang)
  @IsOptional()
  preferredLanguage?: string;
}
