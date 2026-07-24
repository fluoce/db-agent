import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { DbAdapterInterface } from './types/database.interface';
import { DatabaseType } from './types/database.types';
import { PostgresqlAdapter } from './postgresql/postgresql.adapter';

@Injectable()
export class DatabaseFactory {
  constructor(
    @Inject(forwardRef(() => PostgresqlAdapter))
    private readonly postgres: PostgresqlAdapter,
  ) {}

  getAdapter(type: DatabaseType): DbAdapterInterface {
    switch (type) {
      case DatabaseType.POSTGRES:
        return this.postgres;

      default:
        throw new BadRequestException(`Unsupported database: ${type}`);
    }
  }
}
