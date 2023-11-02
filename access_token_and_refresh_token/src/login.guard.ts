import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private readonly jwtService: JwtService;
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    /**
     * 1. 从请求头中获取 authorization
     */
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    /**
     * 2. 如果 authorization 不存在，抛出异常
     */
    if (!authorization) {
      throw new UnauthorizedException('未登录1');
    }
    /**
     * 3. 如果 authorization 存在，判断是否是 Bearer 开头
     */
    if (!authorization.startsWith('Bearer')) {
      throw new UnauthorizedException('未登录2');
    }
    /**
     * 4. 如果是 Bearer 开头，判断 token 是否存在
     */
    const token = authorization.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('未登录3');
    }
    /**
     * 5. 如果 token 存在，判断 token 是否有效
     */
    try {
      this.jwtService.verify(token);
      request.user = this.jwtService.decode(token);
      console.log(this.jwtService.verify(token));
      console.log(this.jwtService.decode(token));
    } catch (e) {
      throw new UnauthorizedException('token失效');
    }
    /**
     * 6. 如果 token 有效，返回 true
     */
    return true;
  }
}
