import { Module } from '@nestjs/common';
import { BitcoinsService } from './bitcoins.service';
import { BitcoinsController } from './bitcoins.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Bitcoin, BitcoinSchema } from './schemas/bitcoin.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Bitcoin.name, schema: BitcoinSchema
      }
    ]),
  ],
  controllers: [BitcoinsController],
  providers: [BitcoinsService]
})
export class BitcoinsModule { }
