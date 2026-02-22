import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateSpaceDto {
  @ApiProperty({
    example: 'My Space',
    description: 'The name of the space to be created',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;
}
