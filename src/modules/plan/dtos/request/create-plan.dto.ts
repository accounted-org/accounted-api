import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreatePlanPriceDto } from './create-plan-price.dto';

export class CreatePlanDto {
  @ApiProperty({
    example: 'plan_1',
    description: 'Unique code used to identify the plan',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  code: string;

  @ApiProperty({
    example: 'plan.plan_1.promo',
    description: 'I18n key for promotional text',
    required: false,
  })
  @IsString()
  @IsOptional()
  promoTextKey?: string;

  @ApiProperty({
    example: true,
    description: 'Whether the plan is active',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'Prices to be created together with the plan',
    type: CreatePlanPriceDto,
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePlanPriceDto)
  planPrices: CreatePlanPriceDto[];
}
