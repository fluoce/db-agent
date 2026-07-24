import { Inject, Injectable } from '@nestjs/common';
import { DbAdapterInterface } from '../types/database.interface';
import knex from 'knex';
import { DbConnectDto } from 'src/routes/db/types/db.types';
import { databaseResMessage } from '../messages/database-res.message';
import { BuildSchema } from './build.schema';
import { DatabaseSchemaType, DatabaseType } from '../types/database.types';
import { LlmFactory } from 'src/module/llm/llm.factory';
import { LlmType } from 'src/module/llm/types/llm.types';
import type { StorageService } from 'src/module/storage/types/storage.interface';
import { activeStorageProvider } from 'src/config/storage.config';
import { buildPrompt } from './func/build.prompt';
import { validateSql } from './func/vaildate.sql';
import { DatabaseCoreService } from 'src/core/database-core/database-core.service';
import { Database } from '@prisma/client';

@Injectable()
export class PostgresqlAdapter implements DbAdapterInterface {
  constructor(
    private readonly buildSchema: BuildSchema,
    private readonly llm: LlmFactory,
    @Inject(activeStorageProvider)
    private readonly storage: StorageService,
    private readonly dbCore: DatabaseCoreService,
  ) {}

  connection(connectionDto: DbConnectDto): knex.Knex {
    return knex({
      client: 'pg',
      connection: {
        ...connectionDto,
        ssl: {
          rejectUnauthorized: false,
        },
      },
    });
  }

  disConnection(pg: knex.Knex) {
    pg.destroy();
    return pg;
  }

  async test(connectionDto: DbConnectDto): Promise<{
    success: boolean;
    message: string;
  }> {
    const pg = this.connection(connectionDto);
    try {
      await pg.raw('SELECT 1');
      return {
        message: databaseResMessage.testSuccess,
        success: true,
      };
    } catch (error: any) {
      return {
        message: databaseResMessage.testFailed(error?.message),
        success: false,
      };
    } finally {
      await pg.destroy();
    }
  }

  async storeSchema({
    connectionDto,
    connectionId,
  }: {
    connectionDto: DbConnectDto;
    connectionId: string;
  }): Promise<{
    success: boolean;
    schema: DatabaseSchemaType | null;
    message?: string;
  }> {
    const pg = this.connection(connectionDto);

    const [databaseInfo, databaseEnums, databaseTables] = await Promise.all([
      this.buildSchema.getDatabaseInfo({
        pg,
      }),
      this.buildSchema.getDatabaseEnums({
        pg,
      }),
      this.buildSchema.getDatabaseTables({
        pg,
      }),
    ]);

    if (!databaseInfo) {
      return {
        success: false,
        schema: null,
        message: databaseResMessage.schemaBuildedFailed(
          'version, database name, or schema discovery failed',
        ),
      };
    }

    if (!databaseEnums) {
      return {
        success: false,
        schema: null,
        message: databaseResMessage.schemaBuildedFailed(
          'enums discovery failed',
        ),
      };
    }

    if (!databaseTables) {
      return {
        success: false,
        schema: null,
        message: databaseResMessage.schemaBuildedFailed(
          'tables discovery failed',
        ),
      };
    }

    const schema = {
      connectionId,
      database: {
        engine: databaseInfo?.engine,
        version: databaseInfo?.version,
        full_version: databaseInfo?.full_version,
        name: databaseInfo?.name,
        schema: databaseInfo?.schema,
      },
      enums: databaseEnums,
      tables: databaseTables,
    };

    return {
      success: true,
      schema,
      message: databaseResMessage.schemaBuildedSuccess,
    };
  }

  async generateQuery({
    message,
    databaseObjectKey,
  }: {
    message: string;
    databaseObjectKey: string;
  }): Promise<{
    success: boolean;
    query: string | null;
    message?: string;
  }> {
    const file = await this.storage.getObject({
      key: databaseObjectKey,
    });

    if (!file) {
      return {
        success: false,
        query: null,
      };
    }

    const schema = JSON.parse(file.toString('utf-8'));

    const prompt = buildPrompt({
      message,
      schema,
    });

    const llm = this.llm.getAdapter(LlmType.GROQ);

    const sql = await llm.sql(prompt);

    if (!sql) {
      return {
        success: false,
        query: null,
      };
    }

    return {
      success: true,
      query: sql,
    };
  }

  async executeQuery({
    database,
    query,
  }: {
    database: Database;
    query: string;
  }): Promise<{ success: boolean; result?: any; message?: string }> {
    const isValidSql = validateSql(query);

    if (!isValidSql) {
      return {
        success: false,
        result: null,
        message: databaseResMessage.invalidQuery,
      };
    }

    if (!database) {
      return {
        success: false,
        result: null,
      };
    }

    const pg = this.connection({
      database: database?.database,
      host: database?.host,
      port: database?.port,
      user: database?.user,
      password: database?.password,
      type: database?.type as DatabaseType,
    });

    const result = await pg.raw(query).catch(() => {});

    this.disConnection(pg);

    if (!result) {
      return {
        success: false,
        result: null,
        message: databaseResMessage.noResultOnqueyExcution,
      };
    }

    return {
      success: true,
      result,
    };
  }
}
