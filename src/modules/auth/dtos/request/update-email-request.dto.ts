import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UpdateEmailRequestDto {
  @IsEmail()
  @ApiProperty({
    description: 'New email to change to',
  })
  email: string;
}
