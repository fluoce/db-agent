import { Injectable, Inject, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  async set(key: string, value: any, ttl: number): Promise<boolean> {
    try {
      const data = JSON.stringify(value);
      const result = await this.redis.set(key, data, 'EX', ttl);
      return result === 'OK';
    } catch (error) {
      this.logger.error('redis set failed', error);
      return false;
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      if (!value) return null;
      return JSON.parse(value);
    } catch (error) {
      this.logger.error('redis get failed', error);
      return null;
    }
  }

  async del(key: string) {
    try {
      await this.redis.del(key);
    } catch (error) {
      this.logger.error('redis set failed', error);
    }
  }

  async getDel<T = any>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.getdel(key);
      if (!value) return null;
      return JSON.parse(value);
    } catch (error) {
      this.logger.error('redis getdel failed', error);
      return null;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return !!result;
    } catch (error) {
      this.logger.error('redis exists check failed', error);
      return false;
    }
  }

  async setIfNotExists(key: string, ttl: number): Promise<boolean> {
    try {
      const result = await this.redis.set(key, '1', 'EX', ttl, 'NX');
      return result === 'OK';
    } catch (error) {
      this.logger.error('redis set nx failed', error);
      return false;
    }
  }

  async incr(key: string): Promise<number> {
    try {
      const result = await this.redis.incr(key);
      return result ?? 1;
    } catch (error) {
      this.logger.error('redis incr failed', error);
      return 1;
    }
  }

  async expire(key: string, ttl: number): Promise<void> {
    try {
      await this.redis.expire(key, ttl);
    } catch (error) {
      this.logger.error('redis expire failed', error);
    }
  }
}
