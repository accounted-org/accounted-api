import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Lang } from '../../../../@types';

export class UpdateUserDto {
  @IsString()
  @MinLength(3)
  @IsOptional()
  name?: string;

  @IsString()
  @IsEnum(Lang)
  @IsOptional()
  preferredLanguage?: string;
}
