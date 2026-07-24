import { Module } from '@nestjs/common';
import { JwtService } from './jwt/jwt.service';
import { JwtGuard } from './jwt/jwt.guard';
import { DatabaseCoreModule } from 'src/core/database-core/database-core.module';
import { RateLimitGuard } from './ratelimit/ratelimit.guard';
import { DbGuard } from './db/db.guard';

@Module({
  imports: [DatabaseCoreModule],
  providers: [JwtService, JwtGuard, RateLimitGuard, DbGuard],
  exports: [JwtService, JwtGuard, RateLimitGuard, DbGuard],
})
export class GuardModule {}
