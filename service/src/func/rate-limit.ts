import { HttpException, HttpStatus } from '@nestjs/common';
import { RedisService } from 'src/lib/redis/redis.service';

export async function rateLimitByIp(
  redis: RedisService,
  ip: string | undefined | null,
  limit: number = 5,
  windowSeconds: number = 1,
) {
  if (!ip) return;

  const key = `rl:ip:${ip}`;

  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, windowSeconds);
  }

  if (Number(count) > limit) {
    throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
  }
}
