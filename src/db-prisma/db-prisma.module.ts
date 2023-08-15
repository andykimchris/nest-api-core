import { Global, Module } from '@nestjs/common';
import { DbPrismaService } from './db-prisma.service';

@Global()
@Module({
  providers: [DbPrismaService],
  exports: [DbPrismaService],
})
export class DbPrismaModule {}
