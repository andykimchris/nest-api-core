import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorators/user.decorator';
import { UserService } from './user.service';
import { EditUserDto } from './dto';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  getUser(@GetUser() user: User) {
    return user;
  }

  @Patch(':id')
  updateUser(@Param('id') userId: string, @Body() dto: EditUserDto) {
    return this.userService.updateUser(userId, dto);
  }
}
