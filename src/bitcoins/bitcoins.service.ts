import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBitcoinDto } from './dto/bitcoin.dto';
import { Bitcoin } from './schemas/bitcoin.schema';

@Injectable()
export class BitcoinsService {

  constructor(
    @InjectModel(Bitcoin.name) private bitcoinModel: Model<Bitcoin>
  ) { }

  async createBitcoin(input: CreateBitcoinDto): Promise<Bitcoin> {
    const createdCat = new this.bitcoinModel(input);
    return createdCat.save();
  }

  async getBitcoins(): Promise<Bitcoin[]> {
    let start_date = new Date();
    start_date.setDate(start_date.getDate() - 10);
    start_date = new Date(start_date.getFullYear(), start_date.getMonth(), start_date.getDate(), -5, 0, 0);

    return this.bitcoinModel.aggregate([
      { $sort: { updated: -1 } },
      {
        $match: { updated: { $gte: start_date, $lte: new Date() }, }
      },
      {
        $group: {
          _id: { day: "$day", month: "$month", year: "$year" },
          updated_tmp: { $max: "$updated" },
          updated: { $max: "$updated" },
          bpi_usd: { $first: "$bpi_usd" },
          bpi_euro: { $first: "$bpi_euro" }
        },
      },
      { $sort: { updated_tmp: -1 } },
      {
        $project: {
          bpi_usd: 1,
          bpi_euro: 1,
          updated: 1,
        }
      },
    ])
  }
}
