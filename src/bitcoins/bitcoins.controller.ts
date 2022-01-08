import { Controller, Get } from '@nestjs/common';
import { BitcoinsService } from './bitcoins.service';
import { Bitcoin } from './schemas/bitcoin.schema';

@Controller('bitcoins')
export class BitcoinsController {
  constructor(private readonly bitcoinsService: BitcoinsService) { }

  @Get()
  async getBitcoins(): Promise<Bitcoin[]> {
    return this.bitcoinsService.getBitcoins();
  }

}
