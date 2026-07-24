import { Injectable } from '@nestjs/common';
import { GroqAdapter } from './groq/groq.adapter';
import { LlmType } from './types/llm.types';

@Injectable()
export class LlmFactory {
  constructor(private readonly groq: GroqAdapter) {}

  getAdapter(type: LlmType) {
    switch (type) {
      case LlmType.GROQ:
        return this.groq;
      default:
        throw new Error(`Unsupported llm provider: ${type}`);
    }
  }
}
