import { Type } from 'class-transformer';
import { IsDate, IsString, MaxLength } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @MaxLength(150)
  title!: string;

  @IsString()
  description!: string;

  @Type(() => Date)
  @IsDate()
  date!: Date;

  @IsString()
  @MaxLength(200)
  location!: string;
}
