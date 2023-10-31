import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Session,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() user: LoginUserDto, @Session() session) {
    const foundUser = await this.userService.login(user);
    session.user = {
      username: user.username,
    };
    return 'success';
  }
}
