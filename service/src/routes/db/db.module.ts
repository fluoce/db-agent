import { Module } from '@nestjs/common';
import { DbController } from './db.controller';
import { DbService } from './db.service';
import { DatabaseModule } from 'src/module/database/database.module';
import { DatabaseCoreModule } from 'src/core/database-core/database-core.module';
import { StorageModule } from 'src/module/storage/storage.module';
import { IdModule } from 'src/lib/id/id.module';

@Module({
  imports: [IdModule, DatabaseModule, DatabaseCoreModule, StorageModule],
  controllers: [DbController],
  providers: [DbService],
})
export class DbModule {}
