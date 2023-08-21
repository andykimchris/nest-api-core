import { ForbiddenException, Injectable } from '@nestjs/common';
import { DbPrismaService } from '../db-prisma/db-prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private prismaService: DbPrismaService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}
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
      return this.signToken(user.id, user.email);
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

    return this.signToken(user.id, user.email);
  }

  async signToken(userId: number, email: string) {
    const payload = { email, userId };
    const secret = this.configService.get('JWT_SECRET_KEY');

    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '20m',
      secret,
    });

    return {
      access_token,
    };
  }
}
