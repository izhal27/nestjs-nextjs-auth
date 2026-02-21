import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { JwtStrategy } from 'src/auth/strategy/jwt-auth.strategy';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtStrategy)
  getUsers() {
    return this.userService.findAll({});
  }

  @Get('profile')
  @UseGuards(JwtStrategy)
  getUser(@Request() req) {
    return this.userService.find({ id: req.user.id });
  }
}
