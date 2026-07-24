import { BadRequestException, Controller, Query, Sse } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Observable } from 'rxjs';
import { Db } from 'src/decorator/db.decorator';
import type { Database } from '@prisma/client';
import { chatResMessage } from './messages/chat-res.message';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Sse('db/:databaseId')
  stream(
    @Db() db: Database,
    @Query('message') message: string,
  ): Observable<string> {
    if (!message) {
      throw new BadRequestException(chatResMessage.messageMissing);
    }
    if (!db) {
      throw new BadRequestException(chatResMessage.noDatabaseInfo);
    }
    return new Observable<string>((observer) => {
      (async () => {
        for await (const value of this.chatService.streamDbRes({
          message,
          database: db,
        })) {
          observer.next(value);
        }
        observer.complete();
      })().catch((err) => {
        observer.error(err);
      });
    });
  }
}
