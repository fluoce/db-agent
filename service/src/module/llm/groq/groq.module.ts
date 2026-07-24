import { Module } from '@nestjs/common';
import { GroqAdapter } from './groq.adapter';
import { ToolModule } from 'src/module/tool/tool.module';

@Module({
  imports: [ToolModule],
  providers: [GroqAdapter],
  exports: [GroqAdapter],
})
export class GroqModule {}
