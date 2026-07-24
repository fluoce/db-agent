import { Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { databaseConfig } from 'src/config/database.config';

interface RedisConnectionProps {
  url?: string;
  name?: string;
  maxRetries?: number;
  retryDelay?: number;
}

export function createRedis(props: RedisConnectionProps = {}): Redis {
  const redisUrl = props.url ?? databaseConfig().redisUrl;
  const loggerName = props.name ?? 'Redis';
  const maxRetries = props.maxRetries ?? 10;
  const retryDelay = props.retryDelay ?? 30_000;

  const logger = new Logger(loggerName);

  if (!redisUrl) {
    logger.error('REDIS_URL environment variable is not set.');
    throw new Error('REDIS_URL must be set');
  }

  const redis = new Redis(redisUrl, {
    retryStrategy(times: number) {
      if (times > maxRetries) {
        logger.error(
          `Redis retry limit exceeded (${maxRetries}). Stopping reconnect attempts.`,
        );
        return null;
      }

      logger.warn(`Redis reconnect attempt ${times}/${maxRetries}`);

      return retryDelay;
    },
  });

  redis.on('connect', () => {
    logger.log('Redis connected');
  });

  redis.on('ready', () => {
    logger.log('Redis ready');
  });

  redis.on('reconnecting', () => {
    logger.warn('Redis reconnecting...');
  });

  redis.on('error', (err) => {
    logger.error(`Redis error: ${err?.message}`);
  });

  redis.on('close', () => {
    logger.warn('Redis connection closed');
  });

  redis.on('end', () => {
    logger.warn('Redis connection ended');
  });

  return redis;
}
