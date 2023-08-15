import { ForbiddenException, Injectable } from '@nestjs/common';
import { DbPrismaService } from 'src/db-prisma/db-prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
@Injectable()
export class AuthService {
  constructor(private prismaService: DbPrismaService) {}
  async signup(dto: AuthDto) {
    try {
      // generate a password hash
      const hash = await argon.hash(dto.password);

      const user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      delete user.hash;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
        throw error;
      }
    }
  }

  async signin(dto: AuthDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('Credentials incorrect');

    const hasPasswordMatch = await argon.verify(user.hash, dto.password);
    if (!hasPasswordMatch)
      throw new ForbiddenException('Credentials incorrect');

    delete user.hash;
    return user;
  }
}
