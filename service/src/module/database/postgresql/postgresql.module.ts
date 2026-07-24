import { Module } from '@nestjs/common';
import { PostgresqlAdapter } from './postgresql.adapter';
import { BuildSchema } from './build.schema';
import { LlmModule } from 'src/module/llm/llm.module';
import { StorageModule } from 'src/module/storage/storage.module';
import { DatabaseCoreModule } from 'src/core/database-core/database-core.module';

@Module({
  imports: [LlmModule, StorageModule, DatabaseCoreModule],
  providers: [PostgresqlAdapter, BuildSchema],
  exports: [PostgresqlAdapter],
})
export class PostgresqlModule {}
