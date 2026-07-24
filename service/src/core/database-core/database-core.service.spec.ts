import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseCoreService } from './database-core.service';

describe('DatabaseCoreService', () => {
  let service: DatabaseCoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseCoreService],
    }).compile();

    service = module.get<DatabaseCoreService>(DatabaseCoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
