import { Injectable } from '@nestjs/common';
import { Book, Language } from './entities/books.entity';

@Injectable()
export class BooksService {
  private books: Book[] = [
    {
      id: 1,
      title: 'Mes aventures du codes',
      publicationDate: '2022-02-28',
      numberOfPages: 10,
      author: 'John Doe',
      language: Language.FRENCH,
    },
    {
      id: 2,
      title: 'Shadows of Tomorrow',
      publicationDate: '2021-01-10',
      numberOfPages: 400,
      author: 'John Smith',
      language: Language.ENGLISH,
    },
  ];

  findBooks() {
    return this.books;
  }
}
