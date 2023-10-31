import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private client: RedisClientType;
  async listGet(key: string) {
    return await this.client.lRange(key, 0, -1);
  }

  async listSet(key: string, list: Array<string>, ttl?: number) {
    for (let i = 0; i < list.length; i++) {
      await this.client.lPush(key, list[i]);
    }
    if (ttl) {
      await this.client.expire(key, ttl);
    }
  }

  async setSet(key: string, set: Array<string>, ttl?: number) {
    for (let i = 0; i < set.length; i++) {
      await this.client.sAdd(key, set[i]);
    }
    if (ttl) {
      await this.client.expire(key, ttl);
    }
  }

  async setGet(key: string) {
    return await this.client.sMembers(key);
  }

  async setRemove(key: string, value: string) {
    await this.client.sRem(key, value);
  }
}
