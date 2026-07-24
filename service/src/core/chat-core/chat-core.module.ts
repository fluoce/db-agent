import { Module } from '@nestjs/common';
import { ChatCoreService } from './chat-core.service';

@Module({
  providers: [ChatCoreService]
})
export class ChatCoreModule {}
