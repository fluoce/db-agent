import { forwardRef, Module } from '@nestjs/common';
import { DatabaseToolService } from './database-tool/database-tool.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [forwardRef(() => DatabaseModule)],
  providers: [DatabaseToolService],
  exports: [DatabaseToolService],
})
export class ToolModule {}
