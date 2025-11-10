import {
  Controller,
  Get,
  Body,
  Post,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { GetBookFilterDto } from '../dto/get-book-filter.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  findAll(@Query() filterDto: GetBookFilterDto) {
    return this.booksService.findBooks(filterDto);
  }

  @Post()
  create(@Body() body: CreateBookDto) {
    return this.booksService.createBook(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findBookById(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateBookDto) {
    const book = this.booksService.updateBook(+id, body);
    return book;
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.booksService.deleteBook(+id);
  }
}
