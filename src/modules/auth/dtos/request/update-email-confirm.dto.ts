import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class UpdateEmailConfirmDto {
  @IsJWT()
  @ApiProperty({
    description: 'Token to confirm user authenticity',
  })
  token: string;
}
