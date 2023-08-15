import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DbPrismaModule } from 'src/db-prisma/db-prisma.module';

@Module({
  controllers: [AuthController],
  imports: [DbPrismaModule, JwtModule.register({})],
  providers: [AuthService],
})
export class AuthModule {
  constructor(private authService: AuthService) {}
}
