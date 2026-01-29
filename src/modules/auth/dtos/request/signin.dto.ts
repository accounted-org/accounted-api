import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john@email.com',
  })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'strongPassword123',
  })
  password: string;
}
