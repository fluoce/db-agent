import { Module } from '@nestjs/common';
import { GroqModule } from './groq/groq.module';
import { LlmFactory } from './llm.factory';

@Module({
  imports: [GroqModule],
  providers: [LlmFactory],
  exports: [LlmFactory],
})
export class LlmModule {}
