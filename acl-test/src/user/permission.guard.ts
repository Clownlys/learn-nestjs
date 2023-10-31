import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { Reflector } from '@nestjs/core';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(UserService)
  private userService: UserService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(Reflector)
  private reflector: Reflector;
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('PermissionGuard');
    const request = context.switchToHttp().getRequest();
    const user = request.session.user;
    // console.log(foundUser);
    let permissions = await this.redisService.listGet(
      `user_${user.username}_permissions`,
    );
    if (permissions.length === 0) {
      const foundUser = await this.userService.findByUsername(user.username);
      permissions = foundUser.permissions.map((item) => item.name);
      this.redisService.listSet(
        `user_${user.username}_permissions`,
        permissions,
        60 * 30,
      );
    }

    const needPermissions = this.reflector.get<string[]>(
      'permission',
      context.getHandler(),
    );
    console.log('needPermissions', needPermissions);
    console.log('permissions', permissions);
    if (
      needPermissions.every((item) =>
        permissions.some((permission) => {
          return permission === item;
        }),
      )
    ) {
      return true;
    } else {
      throw new UnauthorizedException({
        message: '没有访问该api的权限',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }
  }
}
