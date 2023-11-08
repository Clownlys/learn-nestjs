import { Inject, Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class SessionService {
  @Inject(RedisService)
  private readonly redisService: RedisService;

  async setSession(sid: string, value: Record<string, any>, ttl?: number) {
    if (!sid) {
      sid = this.generateSessionId();
    }
    await this.redisService.hashSet(`sid_${sid}`, value, ttl);
    return sid;
  }

  async getSession<SessionType extends Record<string, any>>(
    sid: string,
  ): Promise<SessionType>;
  async getSession(sid: string) {
    return await this.redisService.hashGet(`sid_${sid}`);
  }

  generateSessionId() {
    return (
      Math.random().toString(36).substring(2, 12) +
      Math.random().toString(36).substring(2, 12)
    ).toUpperCase();
  }
}
