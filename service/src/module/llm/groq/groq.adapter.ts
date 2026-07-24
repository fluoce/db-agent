import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LlmAdapterInterface } from '../types/llm.interface';
import { createGroq } from '@ai-sdk/groq';
import { streamText, generateObject, stepCountIs } from 'ai';
import { z } from 'zod';
import { aiConfig } from 'src/config/ai.config';
import { Database } from '@prisma/client';
import { DatabaseToolService } from 'src/module/tool/database-tool/database-tool.service';

@Injectable()
export class GroqAdapter implements LlmAdapterInterface {
  private readonly ai = aiConfig();

  private readonly groq = createGroq({
    apiKey: this.ai.groqApiKey,
  });

  constructor(private readonly dataBaseTool: DatabaseToolService) {}

  async *stream({
    database,
    message,
  }: {
    message: string;
    database: Database;
  }): AsyncGenerator<string> {
    const result = streamText({
      model: this.groq('openai/gpt-oss-120b'),
      prompt: message,
      tools: {
        database_tool: this.dataBaseTool.getDatabaseTool({ database, message }),
      },
      stopWhen: stepCountIs(5),
    });
    try {
      for await (const chunk of result.textStream) {
        yield chunk;
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async sql(message: string): Promise<string> {
    const result = await generateObject({
      model: this.groq('openai/gpt-oss-120b'),
      prompt: message,
      temperature: 0,
      schema: z.object({
        sql: z.string(),
      }),
    });

    return result?.object.sql || '';
  }
}
