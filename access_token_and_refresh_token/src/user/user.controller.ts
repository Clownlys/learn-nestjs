import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  Inject,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  @Post('login')
  async login(@Body(new ValidationPipe()) loginUser: LoginUserDto) {
    console.log(loginUser);
    const user = await this.userService.login(loginUser);

    const access_token = this.jwtService.sign(
      {
        id: user.id,
        username: user.username,
      },
      {
        expiresIn: '30m',
      },
    );
    const refresh_token = this.jwtService.sign(
      {
        id: user.id,
      },
      {
        expiresIn: '7d',
      },
    );

    return {
      access_token,
      refresh_token,
    };
  }

  @Get('refresh')
  async refresh(@Query('refresh_token') refresh_token: string) {
    try {
      const data = this.jwtService.verify(refresh_token);
      const user = await this.userService.findUserById(data.id);
      const access_token = this.jwtService.sign(
        {
          id: user.id,
          username: user.username,
        },
        {
          expiresIn: '30m',
        },
      );
      const new_refresh_token = this.jwtService.sign(
        {
          id: user.id,
        },
        {
          expiresIn: '7d',
        },
      );

      return {
        access_token,
        refresh_token: new_refresh_token,
      };
    } catch (e) {
      throw new UnauthorizedException('token失效, 请重新登录');
    }
  }
}
