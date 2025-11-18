import { Injectable, NotFoundException } from '@nestjs/common';
import { Book } from './entities/books.entity';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { GetBookFilterDto } from '../dto/get-book-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import PostgreSQLErrorCode from '../postgresql-error-codes';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  async findBooks(filterDto: GetBookFilterDto) {
    const { search, publication_date: publicationDate, language } = filterDto;
    const query = this.booksRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.author', 'author');

    if (search) {
      query.andWhere('book.title LIKE :search OR book.author LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (publicationDate) {
      query.andWhere('book.publicationDate = :publicationDate', {
        publicationDate,
      });
    }

    if (language) {
      query.andWhere('book.language = :language', { language });
    }

    const books = await query.getMany();
    return books;
  }

  async createBook(createBookDto: CreateBookDto) {
    const book = this.booksRepository.create({
      ...createBookDto,
      author: {
        id: createBookDto.authorId,
      },
    });

    try {
      return await this.booksRepository.save(book);
    } catch (error) {
      if (error.code === PostgreSQLErrorCode.ForeignKeyViolation) {
        throw new NotFoundException(
          `Author with id ${createBookDto.authorId} doesn't exist`,
        );
      }
      throw error;
    }
  }

  async findBookById(bookId: number) {
    const book = await this.booksRepository.findOneBy({ id: bookId });
    if (!book) {
      throw new NotFoundException(`Book with id ${bookId} not found`);
    }
    return book;
  }

  async updateBook(bookId: number, updateBook: UpdateBookDto) {
    try {
      const book = await this.booksRepository.preload({
        id: bookId,
        ...updateBook,
        ...(updateBook.authorId ? { author: { id: updateBook.authorId } } : {}),
      });

      if (!book) {
        throw new NotFoundException(`Book with id ${bookId} not found`);
      }

      return await this.booksRepository.save(book);
    } catch (error) {
      if (error.code === PostgreSQLErrorCode.ForeignKeyViolation) {
        throw new NotFoundException(
          `Author with id ${updateBook.authorId} doesn't exist`,
        );
      }
      throw error;
    }
  }

  async deleteBook(bookId: number) {
    const book = await this.booksRepository.findOneBy({ id: bookId });
    if (!book) {
      throw new NotFoundException(`Book with id ${bookId} not found`);
    }
    return this.booksRepository.remove(book);
  }
}
