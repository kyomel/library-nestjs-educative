import { Controller, Get, Body, Post, Param } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from '../dto/create-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  findAll() {
    return this.booksService.findBooks();
  }

  @Post()
  create(@Body() body: CreateBookDto) {
    return this.booksService.createBook(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findBookById(Number(id));
  }
}
