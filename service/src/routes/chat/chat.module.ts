import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { DatabaseModule } from 'src/module/database/database.module';
import { LlmModule } from 'src/module/llm/llm.module';
import { StorageModule } from 'src/module/storage/storage.module';

@Module({
  imports: [LlmModule, DatabaseModule, StorageModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
