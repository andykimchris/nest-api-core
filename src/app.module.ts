import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { AuthModule } from './auth/auth.module';
import { DbPrismaModule } from './db-prisma/db-prisma.module';

@Module({
  imports: [UserModule, BookmarkModule, AuthModule, DbPrismaModule],
})
export class AppModule {}
