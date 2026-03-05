import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../utils';

export class ListPlansQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    example: 'plan_1',
    description: 'Search by code, promoTextKey or plan price countryCode',
  })
  @IsString()
  @IsOptional()
  query?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Filter by active status',
  })
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
