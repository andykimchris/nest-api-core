import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DbPrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: 'postgresql://postgres:123qwer@localhost:5434/nest-api-core?schema=public',
        },
      },
    });
  }
}
