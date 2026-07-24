import { Injectable } from '@nestjs/common';
import { LlmFactory } from 'src/module/llm/llm.factory';
import { LlmType } from 'src/module/llm/types/llm.types';
import { Database } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private readonly llm: LlmFactory) {}

  async *streamDbRes({
    message,
    database,
  }: {
    message: string;
    database: Database;
  }): AsyncGenerator<string> {
    const adapter = this.llm.getAdapter(LlmType.GROQ);

    for await (const chunk of adapter.stream({
      database,
      message,
    })) {
      yield chunk;
    }
  }
}
