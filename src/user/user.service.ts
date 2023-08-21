import { Injectable } from '@nestjs/common';
import { EditUserDto } from './dto';
import { DbPrismaService } from '../db-prisma/db-prisma.service';

@Injectable()
export class UserService {
  constructor(private dbPrisma: DbPrismaService) {}

  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.dbPrisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    delete user.hash;
    return user;
  }
}
