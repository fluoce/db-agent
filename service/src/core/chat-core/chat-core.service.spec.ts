import { Test, TestingModule } from '@nestjs/testing';
import { ChatCoreService } from './chat-core.service';

describe('ChatCoreService', () => {
  let service: ChatCoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatCoreService],
    }).compile();

    service = module.get<ChatCoreService>(ChatCoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
