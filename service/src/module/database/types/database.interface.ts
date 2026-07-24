import knex from 'knex';
import { DbConnectDto } from 'src/routes/db/types/db.types';
import { DatabaseSchemaType } from './database.types';
import { Database } from '@prisma/client';

export interface QueryResultInterface {
  rows: any[];
  columns: string[];
  rowCount: number;
}

export interface DbAdapterInterface {
  connection(args: DbConnectDto): knex.Knex;
  disConnection(pg: knex.Knex): any;
  test(args: DbConnectDto): Promise<{
    success: boolean;
    message: string;
  }>;
  storeSchema(args: {
    connectionDto: DbConnectDto;
    connectionId: string;
  }): Promise<{
    success: boolean;
    schema: DatabaseSchemaType | null;
    message?: string;
  }>;
  generateQuery(args: { message: string; databaseObjectKey: string }): Promise<{
    success: boolean;
    query: string | null;
    message?: string;
  }>;
  executeQuery(args: { database: Database; query: string }): Promise<{
    success: boolean;
    result?: any;
    message?: string;
  }>;
}
