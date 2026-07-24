import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Database } from '@prisma/client';
import { DatabaseFactory } from 'src/module/database/database.factory';
import { DatabaseType } from 'src/module/database/types/database.types';
import { toolMessage } from '../messages/tool.message';
import { dynamicTool } from 'ai';
import z from 'zod';
import { buildPrompt } from '../func/build.prompt';

@Injectable()
export class DatabaseToolService {
  constructor(
    @Inject(forwardRef(() => DatabaseFactory))
    private readonly databaseFactory: DatabaseFactory,
  ) {}

  getDatabaseTool({
    message,
    database,
  }: {
    message: string;
    database: Database;
  }) {
    return dynamicTool({
      inputSchema: z.object({}),
      description:
        'Fetch data from the connected database to answer the user question. Only use this when the answer requires actual stored data. Do not use it for greetings, general knowledge, or questions unrelated to the database.',
      execute: async () => {
        const result = await this.getData({ message, database });
        if (!result.success) {
          return { error: result?.message };
        }
        return buildPrompt({
          data: result?.data?.rows,
          message,
        });
      },
    });
  }

  async getData({
    message,
    database,
  }: {
    message: string;
    database: Database;
  }): Promise<{
    success: boolean;
    data?: any;
    message?: string;
  }> {
    const db = this.databaseFactory.getAdapter(database.type as DatabaseType);

    const {
      query,
      success,
      message: msg,
    } = await db.generateQuery({
      message,
      databaseObjectKey: database.objectKey,
    });

    if (!success || !query) {
      return {
        success: false,
        message: msg || toolMessage.noSql,
      };
    }

    const {
      success: suc,
      message: msgs,
      result,
    } = await db.executeQuery({
      database,
      query,
    });

    if (!suc || !result) {
      return {
        success: false,
        message: msgs || toolMessage.noDatabaseResult,
      };
    }
    console.log('sql', query);

    return {
      success: true,
      data: result,
    };
  }
}
