import { Test, TestingModule } from '@nestjs/testing';
import { BitcoinsController } from './bitcoins.controller';
import { BitcoinsService } from './bitcoins.service';

describe('BitcoinsController', () => {
  let controller: BitcoinsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BitcoinsController],
      providers: [BitcoinsService],
    }).compile();

    controller = module.get<BitcoinsController>(BitcoinsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
