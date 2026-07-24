import { Provider } from '@nestjs/common';
import { createRedis } from './create-redis';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

export const RedisProvider: Provider[] = [
  {
    provide: REDIS_CLIENT,
    useFactory: () => createRedis(),
  },
];
