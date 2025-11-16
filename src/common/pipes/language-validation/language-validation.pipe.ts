import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { CreateBookDto } from 'src/dto/create-book.dto';
import { Language } from 'src/books/entities/books.entity';

@Injectable()
export class LanguageValidationPipe implements PipeTransform {
  transform(value: CreateBookDto) {
    const languageValue = value.language;
    const supportedLanguages = [Language.ENGLISH, Language.FRENCH];
    if (!supportedLanguages.includes(languageValue)) {
      throw new BadRequestException('Unsupported language');
    }
    return value;
  }
}
