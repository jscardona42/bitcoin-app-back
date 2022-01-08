import { Module } from '@nestjs/common';
import { ApisService } from './apis.service';
import { ApisController } from './apis.controller';
import { BitcoinsService } from 'src/bitcoins/bitcoins.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Bitcoin, BitcoinSchema } from 'src/bitcoins/schemas/bitcoin.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name: Bitcoin.name, schema: BitcoinSchema
      }
    ]),
  ],
  controllers: [ApisController],
  providers: [ApisService, BitcoinsService]
})
export class ApisModule {}
