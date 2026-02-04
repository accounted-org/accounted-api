import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MfaData {
  @ApiProperty({
    description: 'QrCode to add app in authenticator apps',
  })
  @IsString()
  qrCode: string;

  @ApiProperty({
    description: 'String version of QrCode data',
  })
  @IsString()
  manualCode: string;
}
