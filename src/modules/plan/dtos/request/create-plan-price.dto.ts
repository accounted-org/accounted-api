import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreatePlanPriceDto {
  @ApiProperty({
    example: 'BR',
    description: 'Country code (ISO 3166-1 alpha-2)',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  countryCode: string;

  @ApiProperty({
    example: 'BRL',
    description: 'Currency code (ISO 4217)',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  currency: string;

  @ApiProperty({
    example: 2990,
    description: 'Plan price in minor units (e.g., cents)',
  })
  @IsInt()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 15,
    description: 'Discount percentage from 0 to 100',
    required: false,
  })
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  discountPercent?: number;

  @ApiProperty({
    example: true,
    description: 'Whether this country price is active',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

