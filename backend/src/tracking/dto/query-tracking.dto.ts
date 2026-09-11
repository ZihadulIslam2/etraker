import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryTrackingDto {
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit?: number = 20;

  @IsOptional()
  @IsEnum(['sent', 'opened'])
  status?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
