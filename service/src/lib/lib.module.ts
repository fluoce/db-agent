import { Global, Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { IdModule } from './id/id.module';
import { PrismaModule } from './prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule, RedisModule],
  providers: [RedisModule, IdModule],
  exports: [RedisModule, IdModule, PrismaModule],
})
export class LibModule {}
