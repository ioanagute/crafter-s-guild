import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateMarketItemDto {
  @IsString()
  @MaxLength(150)
  title!: string;

  @IsString()
  description!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsString()
  image?: string;
}
