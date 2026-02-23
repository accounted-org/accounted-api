import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddSpaceMemberDto {
  @ApiProperty({
    description: 'ID of the member to add to the space',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  memberId: string;
}
