import {
  Controller,
  Get,
  Body,
  Post,
  Param,
  Patch,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { GetBookFilterDto } from '../dto/get-book-filter.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/entities/user.entity';
import { AccessControlGuard } from 'src/auth/guards/access-control.guard';

@UseGuards(AuthGuard, AccessControlGuard)
@Controller('books')
export class BooksController {
  private readonly logger = new Logger(BooksController.name);
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @Roles(Role.Admin, Role.Viewer)
  findAll(
    @Query() filterDto: GetBookFilterDto,
    @CurrentUser('email') userInfo,
  ) {
    this.logger.log(
      `Fetching all books with filters: ${JSON.stringify(filterDto)}`,
    );
    console.log(userInfo);
    return this.booksService.findBooks(filterDto);
  }

  @Post()
  @Roles(Role.Admin)
  create(@Body() body: CreateBookDto) {
    this.logger.log(`Creating a new book with data: ${JSON.stringify(body)}`);
    return this.booksService.createBook(body);
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Viewer)
  findOne(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Fetching book with id: ${id}`);
    return this.booksService.findBookById(id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  update(@Param('id') id: number, @Body() body: UpdateBookDto) {
    this.logger.log(`Updating book with ID: ${id}`);
    const book = this.booksService.updateBook(+id, body);
    return book;
  }

  @Delete(':id')
  @Roles(Role.Admin)
  delete(@Param('id') id: string) {
    this.logger.log(`Deleting book with ID: ${id}`);
    return this.booksService.deleteBook(+id);
  }
}
