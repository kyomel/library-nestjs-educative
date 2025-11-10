import { Injectable, NotFoundException } from '@nestjs/common';
import { Book, Language } from './entities/books.entity';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { GetBookFilterDto } from '../dto/get-book-filter.dto';
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
      author: 'John Smith',
      publicationDate: '2021-01-10',
      numberOfPages: 400,
      language: Language.ENGLISH,
    },
    {
      id: 3,
      numberOfPages: 400,
      title: 'The Lost Chronicles',
      author: 'Alex Johnson',
      publicationDate: '2023-03-15',
      language: Language.ENGLISH,
    },
    {
      id: 4,
      numberOfPages: 200,
      title: 'Secrets of the Starlight Kingdom',
      author: 'Emily Smith',
      publicationDate: '2022-11-02',
      language: Language.ENGLISH,
    },
    {
      id: 5,
      numberOfPages: 382,
      title: 'Galactic Adventures',
      author: 'Luna Stardust',
      publicationDate: '2021-06-20',
      language: Language.ENGLISH,
    },
    {
      id: 6,
      numberOfPages: 87,
      title: 'Whispers in the Woods',
      author: 'Olivia Whisperingbrook',
      publicationDate: '2021-06-20',
      language: Language.ENGLISH,
    },
    {
      id: 7,
      numberOfPages: 700,
      title: 'Secrets Unveiled',
      author: 'Alex Johnson',
      publicationDate: '2021-08-15',
      language: Language.ENGLISH,
    },
  ];

  findBooks(filterDto: GetBookFilterDto) {
    const {
      search,
      author,
      publication_date: publicationDate,
      language,
    } = filterDto;

    let filteredBooks = this.books;

    if (search) {
      filteredBooks = filteredBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(search.toLowerCase()) ||
          book.author.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (author) {
      filteredBooks = filteredBooks.filter(
        (book) => book.author.toLowerCase() === author.toLowerCase(),
      );
    }

    if (publicationDate) {
      filteredBooks = filteredBooks.filter(
        (book) => book.publicationDate === publicationDate,
      );
    }

    if (language) {
      filteredBooks = filteredBooks.filter(
        (book) => book.language === language,
      );
    }

    return filteredBooks;
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

  updateBook(bookId: number, updateBook: UpdateBookDto) {
    const book = this.findBookById(bookId);
    Object.assign(book, updateBook);
    return book;
  }

  deleteBook(bookId: number) {
    const index = this.books.findIndex((book) => book.id === bookId);
    console.log(index);
    if (index !== -1) {
      this.books.splice(index, 1);
      return { message: `Book with id ${bookId} deleted successfully` };
    }
    throw new NotFoundException(`Book with id ${bookId} not found`);
  }
}
