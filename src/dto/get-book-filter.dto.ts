import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { Language } from 'src/books/entities/books.entity';

export class GetBookFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsDateString()
  publication_date?: string;

  @IsOptional()
  @IsEnum(Language)
  language?: Language;
}
