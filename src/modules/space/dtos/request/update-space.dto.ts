import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateSpaceDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name?: string;
}
