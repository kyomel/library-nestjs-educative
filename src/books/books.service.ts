import { Injectable, NotFoundException } from '@nestjs/common';
import { Book, Language } from './entities/books.entity';
import { CreateBookDto } from '../dto/create-book.dto';
import generateId from 'src/helper/generateId';

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

  createBook(data: CreateBookDto): Book {
    const book = {
      id: generateId(),
      ...data,
    };

    this.books.push(book);
    return book;
  }

  findBookById(bookId: number) {
    const book = this.books.find((book) => book.id === bookId);
    if (!book) {
      throw new NotFoundException(`Book with id ${bookId} not found`);
    }
    return book;
  }
}
