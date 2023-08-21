import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { DbPrismaModule } from './db-prisma/db-prisma.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { BookmarkController } from './bookmark/bookmark.controller';
import { BookmarkService } from './bookmark/bookmark.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    DbPrismaModule,
    UserModule,
  ],
  controllers: [UserController, BookmarkController],
  providers: [UserService, BookmarkService],
})
export class AppModule {}
