import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Role } from './user/entities/role.entity';
import { Reflector } from '@nestjs/core';

declare module 'express' {
  interface Request {
    user: {
      username: string;
      roles: Role[];
    };
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private readonly jwtService: JwtService;

  @Inject(Reflector)
  private reflector: Reflector;
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requireLogin = this.reflector.getAllAndOverride('require-login', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requireLogin) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization || '';
    const bearer = authorization.split(' ');
    if (!bearer || bearer.length !== 2) {
      throw new HttpException('请登录后再操作', HttpStatus.UNAUTHORIZED);
    }
    const token = bearer[1];
    try {
      const payload = this.jwtService.verify(token);
      request.user = payload;
      return true;
    } catch (e) {
      throw new UnauthorizedException({
        message: 'token已失效，请重新登录',
      });
    }
  }
}
