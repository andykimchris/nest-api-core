import { Injectable } from '@nestjs/common';
import { EditUserDto } from './dto';
import { DbPrismaService } from '../db-prisma/db-prisma.service';

@Injectable()
export class UserService {
  constructor(private dbPrisma: DbPrismaService) {}

  async updateUser(userId: string, userDto: EditUserDto) {
    const user = await this.dbPrisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        ...userDto,
      },
    });

    delete user.hash;
    return user;
  }
}
