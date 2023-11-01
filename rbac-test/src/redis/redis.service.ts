import { Inject } from '@nestjs/common';
import { RedisClientType } from 'redis';

export class RedisService {
  @Inject('REDIS_CLIENT')
  private readonly client: RedisClientType;

  async set(key: string, value: string) {
    return await this.client.set(key, value);
  }

  async get(key: string) {
    return await this.client.get(key);
  }

  async keys(pattern: string) {
    return await this.client.keys(pattern);
  }

  async lRange(key: string, start: number, stop: number) {
    return await this.client.lRange(key, start, stop);
  }

  async lPush(key: string, value: string) {
    return await this.client.lPush(key, value);
  }

  async expire(key: string, seconds: number) {
    return await this.client.expire(key, seconds);
  }
}
