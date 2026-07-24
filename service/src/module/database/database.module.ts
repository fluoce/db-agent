import { Module } from '@nestjs/common';
import { MongodbModule } from './mongodb/mongodb.module';
import { PostgresqlModule } from './postgresql/postgresql.module';
import { MssqlModule } from './mssql/mssql.module';
import { DatabaseFactory } from './database.factory';

@Module({
  imports: [PostgresqlModule, MssqlModule, MongodbModule],
  providers: [DatabaseFactory],
  exports: [DatabaseFactory],
})
export class DatabaseModule {}
