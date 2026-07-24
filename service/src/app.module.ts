import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LibModule } from './lib/lib.module';
import { DatabaseModule } from './module/database/database.module';
import { LlmModule } from './module/llm/llm.module';
import { ChatModule } from './routes/chat/chat.module';
import { DbModule } from './routes/db/db.module';
import { DatabaseCoreModule } from './core/database-core/database-core.module';
import { ChatCoreModule } from './core/chat-core/chat-core.module';
import { StorageModule } from './module/storage/storage.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './guard/jwt/jwt.guard';
import { GuardModule } from './guard/guard.module';
import { RateLimitGuard } from './guard/ratelimit/ratelimit.guard';
import { DbGuard } from './guard/db/db.guard';
import { ToolModule } from './module/tool/tool.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ChatModule,
    LibModule,
    DatabaseModule,
    LlmModule,
    DbModule,
    DatabaseCoreModule,
    StorageModule,
    ChatCoreModule,
    GuardModule,
    ToolModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
    {
      provide: APP_GUARD,
      useClass: DbGuard,
    },
  ],
})
export class AppModule {}
