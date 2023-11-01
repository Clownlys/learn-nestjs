import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from './user/user.service';
import { Permission } from './user/entities/permission.entity';
import { Role } from './user/entities/role.entity';
import { Reflector } from '@nestjs/core';
import { RedisService } from './redis/redis.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(UserService)
  private readonly userService: UserService;

  @Inject(Reflector)
  private readonly reflector: Reflector;

  @Inject(RedisService)
  private readonly redisService: RedisService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return true;
    }
    /**
     * 1. 从redis中获取用户的权限
     */
    const cachePermissions = await this.redisService.lRange(
      `permissions:${user.username}`,
      0,
      -1,
    );
    /**
     * 2. 如果redis中没有用户的权限，则从数据库中获取用户的权限
     */
    let userPermissions: string[] = [];
    if (cachePermissions.length === 0) {
      const roles = await this.userService.findRolesByIds(
        user.roles.map((role) => role.id),
      );
      userPermissions = roles
        .reduce((acc: Permission[], cur) => {
          return acc.concat(cur.permissions);
        }, [])
        .map((permission) => permission.name);
      console.log(userPermissions);
      /**
       * 2.1 将用户的权限存入redis中
       */
      userPermissions.forEach(async (permission) => {
        await this.redisService.lPush(
          `permissions:${user.username}`,
          permission,
        );
      });
      /**
       * 2.2 设置redis中用户的权限的过期时间
       */
      await this.redisService.expire(`permissions:${user.username}`, 60 * 60);
    }
    /**
     * 3. 从元数据中获取需要的权限
     */
    const requirePermissions = this.reflector.getAllAndMerge<string[]>(
      'require-permission',
      [context.getHandler(), context.getClass()],
    );
    console.log('requirePermissions', requirePermissions);
    /**
     * 4. 判断用户是否拥有需要的权限
     */
    requirePermissions.every((requirePermission) => {
      if (
        !userPermissions.some((permission) => permission === requirePermission)
      ) {
        throw new UnauthorizedException({
          message: '权限不足',
          status: HttpStatus.UNAUTHORIZED,
        });
      }
    });

    return true;
  }
}
