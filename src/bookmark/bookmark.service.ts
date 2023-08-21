import { ForbiddenException, Injectable } from '@nestjs/common';
import { DbPrismaService } from '../../src/db-prisma/db-prisma.service';
import { CreateBookmarkDTO } from './dto';
import { EditBookmarkDTO } from './dto/';

@Injectable()
export class BookmarkService {
  constructor(private prisma: DbPrismaService) {}
  getBookmarks(userId: number) {
    return this.prisma.bookmark.findMany({
      where: { userId },
    });
  }

  getBookmark(userId: number, id: number) {
    return this.prisma.bookmark.findUnique({
      where: { userId, id },
    });
  }

  async createBookmark(userId: number, dto: CreateBookmarkDTO) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });

    return bookmark;
  }
  async updateBookmark(userId: number, id: number, dto: EditBookmarkDTO) {
    // get the bookmark by id
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id,
      },
    });

    // check if user owns the bookmark
    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    return this.prisma.bookmark.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
  }
  async deleteBookmark(userId: number, id: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id,
      },
    });
    // check if user owns the bookmark
    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    await this.prisma.bookmark.delete({
      where: {
        id,
      },
    });
  }
}
