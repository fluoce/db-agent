import { Module, Global } from '@nestjs/common';
import { RedisProvider } from './redis';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [...RedisProvider, RedisService],
  exports: [RedisService],
})
export class RedisModule {}
