import { Module } from '@nestjs/common';
import { DatabaseCoreService } from './database-core.service';
import { IdModule } from 'src/lib/id/id.module';

@Module({
  imports: [IdModule],
  providers: [DatabaseCoreService],
  exports: [DatabaseCoreService],
})
export class DatabaseCoreModule {}
