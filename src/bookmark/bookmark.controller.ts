import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDTO, EditBookmarkDTO } from './dto/';

@UseGuards(AuthGuard('jwt'))
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}
  @Get()
  getBookmarks(@GetUser('id') userId: number) {
    return this.bookmarkService.getBookmarks(userId);
  }

  @Get(':id')
  getBookmark(
    @GetUser('userId') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.bookmarkService.getBookmark(userId, id);
  }

  @Post()
  createBookmark(
    @GetUser('userId') userId: number,
    @Body() dto: CreateBookmarkDTO,
  ) {
    return this.bookmarkService.createBookmark(userId, dto);
  }

  @Patch(':id')
  updateBookmark(
    @GetUser('userId') userId: number,
    @Body() dto: EditBookmarkDTO,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.bookmarkService.updateBookmark(userId, id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBookmark(
    @GetUser('userId') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.bookmarkService.deleteBookmark(userId, id);
  }
}
