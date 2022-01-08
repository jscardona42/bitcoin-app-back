import { Injectable } from '@nestjs/common';
import { BitcoinsService } from 'src/bitcoins/bitcoins.service';
import { CreateBitcoinDto } from 'src/bitcoins/dto/bitcoin.dto';
const fetch = require('node-fetch');

@Injectable()
export class ApisService {

    constructor(
        private readonly bitcoinsService: BitcoinsService
    ) { }

    async saveBitcoinsData() {
        let bitcoins = null;
        try {
            bitcoins = fetch(`http://api.coindesk.com/v1/bpi/currentprice.json`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })
                .then((response) => response.json())
                .then((response) => { return response })
                .catch(error => { return error });
        } catch (error) {
            console.log(error);
            return error;
        }

        const today = new Date();
        bitcoins = await bitcoins;

        var input: CreateBitcoinDto = {
            year: today.getFullYear().toString(),
            month: today.getMonth().toString(),
            day: today.getDate().toString(),
            updated: bitcoins.time.updated,
            bpi_usd: {
                code: bitcoins.bpi.USD.code,
                rate: bitcoins.bpi.USD.rate_float
            }, bpi_euro: {
                code: bitcoins.bpi.EUR.code,
                rate: bitcoins.bpi.EUR.rate_float
            }
        }
        await this.bitcoinsService.createBitcoin(input);
        // .catch(error => { throw new UnauthorizedException("API no disponible. " + error) });
    }
}
