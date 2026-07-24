import { BadRequestException, Injectable } from '@nestjs/common';
import { ulid } from 'ulid';
import { IdInterface } from './types/id.interface';
import { DatabaseType } from 'src/module/database/types/database.types';

@Injectable()
export class IdService implements IdInterface {
  databaseId({ type }: { type: DatabaseType }): string {
    switch (type) {
      case DatabaseType.POSTGRES:
        return `db_pg_${ulid()}`;
      case DatabaseType.MONGODB:
        return `db_mongo_${ulid()}`;
      case DatabaseType.MSSQL:
        return `db_mssql_${ulid()}`;
      default:
        throw new BadRequestException('Unsupported database type');
    }
  }
}
