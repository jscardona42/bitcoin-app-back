import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { bitcoinsHistoric } from '../bitcoins/historic/historic';
import { CreateBitcoinDto } from './dto/bitcoin.dto';
import { Bitcoin } from './schemas/bitcoin.schema';
const fetch = require('node-fetch');
const util = require('util');
const bson = require('bson');
let bitcoin_temp = null;
let count = 0;

@Injectable()
export class BitcoinsService {

  constructor(
    @InjectModel(Bitcoin.name) private bitcoinModel: Model<Bitcoin>
  ) { }

  /**
   * // Obtenemos los datos del bitcoin en las últimas dos semanas
   * @returns Bitcoin[]
   */
  async getBitcoins(): Promise<Bitcoin[]> {
    let start_date = new Date();
    let end_date = new Date();
    start_date.setDate(start_date.getUTCDate() - 14);
    start_date = new Date(start_date.getUTCFullYear(), start_date.getUTCMonth(), start_date.getUTCDate(), -5, 0, 0);

    end_date.setUTCHours(end_date.getUTCHours() - end_date.getUTCHours());
    end_date.setUTCMinutes(end_date.getUTCMinutes() - end_date.getUTCMinutes());
    end_date.setUTCSeconds(end_date.getUTCSeconds() - (end_date.getUTCSeconds() + 1));

    return this.bitcoinModel.aggregate([
      { $sort: { created_at: -1 } },
      {
        $match: { updated: { $gte: start_date, $lte: end_date }, }
      },
      {
        $group: {
          _id: { day: "$day", month: "$month", year: "$year" },
          id: { $first: "$_id" },
          updated_tmp: { $max: "$updated" },
          updated: { $max: "$updated" },
          bpi_usd: { $first: "$bpi_usd" },
          bpi_euro: { $first: "$bpi_euro" },
        },
      },
      { $sort: { updated_tmp: -1 } },
      {
        $project: {
          id: 1,
          bpi_usd: 1,
          bpi_euro: 1,
          updated: 1,
          _id: 1
        }
      },
    ]).catch((err) => {
      throw new InternalServerErrorException("Ocurrió un error durante la consulta");
    });
  }

  /**
   * // Obtenemos el último dato cargado del bitcoin
   * @returns Bitcoin
   */
  async getLastDataBitcoin(): Promise<any> {
    count++;
    let bitcoins = null;
    const today = new Date();
    const generated_id = new bson.ObjectId();

    if (await this.validateInternetConnection()) {
      bitcoins = await this.getApiBitcoins();
      bitcoin_temp = bitcoins;
    } else {
      if (count === 1) {
        count = 0;
        return this.getTopBitcoin();
      }
    }

    var input: CreateBitcoinDto = {
      year: today.getUTCFullYear().toString(),
      month: today.getUTCMonth().toString(),
      day: today.getUTCDate().toString(),
      updated: bitcoin_temp.time.updated,
      bpi_usd: {
        code: bitcoin_temp.bpi.USD.code,
        rate: bitcoin_temp.bpi.USD.rate_float
      }, bpi_euro: {
        code: bitcoin_temp.bpi.EUR.code,
        rate: bitcoin_temp.bpi.EUR.rate_float
      }
    }

    if (bitcoins === null) {
      if (await this.getBitcoinExists(input) === null) {
        await this.createBitcoin(input);
      }
      return this.getTopBitcoin();
    }

    if (!await this.getBitcoinByDate()) {
      await this.createHistoricData();
    }

    let input_return = input;
    Object.assign(input_return, { id: generated_id.toString() });

    let updated = new Date(bitcoins.time.updated);
    if ((updated.getUTCHours() >= 23 && updated.getUTCMinutes() >= 59) || (updated.getUTCHours() >= 12 && updated.getUTCMinutes() >= 0 && updated.getUTCHours() >= 12 && updated.getUTCMinutes() < 5)) {
      await this.createBitcoin(input);
    }
    return input_return;
  }

  /**
   * // Método de creación
  * @returns Bitcoin
  */
  async createBitcoin(input: CreateBitcoinDto): Promise<Bitcoin> {
    return this.bitcoinModel.create(input).catch((err) => {
      throw new InternalServerErrorException("Ocurrió un error durante la consulta");
    });;
  }

  /**
  * // Creamos el histórico de los datos de los últimos 15 días.
  * @returns Bitcoin
  */
  async createHistoricData(): Promise<Bitcoin[]> {
    return this.bitcoinModel.insertMany(bitcoinsHistoric).catch((err) => {
      throw new InternalServerErrorException("Ocurrió un error durante la consulta");
    });;
  }

  /**
  * // Verificamos si los datos del histórico existen
  * @returns Boolean
  */
  async getBitcoinByDate(): Promise<Boolean> {
    let start_date = new Date();
    start_date.setDate(start_date.getUTCDate() - 3);
    const bitcoins = await this.bitcoinModel.find({ day: start_date.getUTCDate(), month: start_date.getUTCMonth(), year: start_date.getUTCFullYear() }).catch((err) => {
      throw new InternalServerErrorException("Ocurrió un error durante la consulta");
    });;

    if (bitcoins.length > 0) {
      return true;
    }
    return false;
  }

  /**
   * Verificamos si existe un documento en la base de datos
   * @param input 
   * @returns Bitcoin
   */
  async getBitcoinExists(input: CreateBitcoinDto): Promise<Bitcoin> {
    var updated = new Date(input.updated);
    return this.bitcoinModel.findOne({ 'bpi_usd.rate': input.bpi_usd.rate, 'bpi_euro.rate': input.bpi_euro.rate, updated: updated }).catch((err) => {
      throw new InternalServerErrorException("Ocurrió un error durante la consulta");
    });;
  }

  /**
   * Obtenemos el último valor registrado en la base de datos.
   * @param input 
   * @returns Bitcoin
   */
  async getTopBitcoin(): Promise<Bitcoin> {
    let bitcoin = null;
    try {
      bitcoin = await this.bitcoinModel.aggregate([
        { $sort: { created_at: -1 } },
        {
          $group: {
            _id: { day: "$day", month: "$month", year: "$year" },
            id: { $first: "$_id" },
            updated_tmp: { $max: "$updated" },
            updated: { $max: "$updated" },
            bpi_usd: { $first: "$bpi_usd" },
            bpi_euro: { $first: "$bpi_euro" },
          },
        },
        { $sort: { updated_tmp: -1 } },
        {
          $project: {
            id: 1,
            bpi_usd: 1,
            bpi_euro: 1,
            updated: 1,
            _id: 0
          }
        },
        {
          $limit: 1
        }
      ])
    } catch (error) {
      throw new InternalServerErrorException("Ocurrió un error durante la consulta");
    }
    return bitcoin[0];
  }


  /**
   * Validamos la conexión a internet
   * @returns boolean
   */
  async validateInternetConnection(): Promise<Boolean> {
    const urlExists = util.promisify(require('url-exists'));
    return urlExists('https://www.google.com');
  }

  /**
   * Obtenemos los datos de la API http://api.coindesk.com/v1/bpi/currentprice.json
   * @returns object
   */
  async getApiBitcoins(): Promise<any> {
    return fetch(`http://api.coindesk.com/v1/bpi/currentprice.json`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((response) => { return response })
      .catch(error => { return { error } });
  }

}
