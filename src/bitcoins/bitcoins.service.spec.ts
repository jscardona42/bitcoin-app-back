import { Test, TestingModule } from '@nestjs/testing';
import { BitcoinsService } from './bitcoins.service';

describe('BitcoinsService', () => {
  let service: BitcoinsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BitcoinsService],
    }).compile();

    service = module.get<BitcoinsService>(BitcoinsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
