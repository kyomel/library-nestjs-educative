import {
  IsString,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsInt,
} from 'class-validator';
import { Language } from '../books/entities/books.entity';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  authorId: number;

  @IsDateString()
  publicationDate: string;

  @IsNumber()
  numberOfPages: number;

  @IsEnum(Language)
  language: Language;
}
