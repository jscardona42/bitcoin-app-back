import { Test, TestingModule } from '@nestjs/testing';
import { BitcoinsController } from '../bitcoins.controller';
import { BitcoinsService } from '../bitcoins.service';
import { CreateBitcoinDto } from '../dto/bitcoin.dto';
import { Bitcoin } from '../schemas/bitcoin.schema';
import { bitcoinStub } from './stubs/bitcoin.stub';

jest.mock('../bitcoins.service');

describe('BitcoinsController', () => {
  let bitcoinsController: BitcoinsController;
  let bitcoinsService: BitcoinsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BitcoinsController],
      providers: [BitcoinsService],
    }).compile();

    bitcoinsController = module.get<BitcoinsController>(BitcoinsController);
    bitcoinsService = module.get<BitcoinsService>(BitcoinsService);
    jest.clearAllMocks();
  });

  describe('getBitcoins', () => {
    describe('when getBitcoins is called', () => {
      let bitcoins: Bitcoin[];

      beforeEach(async () => {
        bitcoins = await bitcoinsService.getBitcoins();
      })

      test('then it should call bitcoinsService', () => {
        expect(bitcoinsService.getBitcoins).toHaveBeenCalled();
      })

      test('then it should return bitcoins', () => {
        expect(bitcoins).toEqual([bitcoinStub()])
      })
    })
  })

  describe('getLastDataBitcoin', () => {
    describe('when getLastDataBitcoin is called', () => {
      let bitcoin: Bitcoin;

      beforeEach(async () => {
        bitcoin = await bitcoinsController.getLastDataBitcoin()
      })

      test('then it should call bitcoinsService', () => {
        expect(bitcoinsService.getLastDataBitcoin).toHaveBeenCalled();
      })

      test('then is should return a bitcoin', () => {
        expect(bitcoin).toEqual(bitcoinStub());
      })
    })
  })

  describe('createBitcoin', () => {
    describe('when createBitcoin is called', () => {
      let bitcoin: Bitcoin;
      let createBitcoinDto: CreateBitcoinDto;

      beforeEach(async () => {
        createBitcoinDto = {
          year: bitcoinStub().year,
          month: bitcoinStub().month,
          day: bitcoinStub().day,
          updated: bitcoinStub().updated,
          bpi_usd: bitcoinStub().bpi_usd,
          bpi_euro: bitcoinStub().bpi_euro
        }
        bitcoin = await bitcoinsService.createBitcoin(createBitcoinDto);
      })

      test('then it should call bitcoinsService', () => {
        expect(bitcoinsService.createBitcoin).toHaveBeenCalledWith(createBitcoinDto);
      })
    })
  })

  describe('createHistoricData', () => {
    describe('when createHistoricData is called', () => {
      let bitcoins: Bitcoin[];
      let createBitcoinDto: CreateBitcoinDto[];

      beforeEach(async () => {
        createBitcoinDto = [{
          year: bitcoinStub().year,
          month: bitcoinStub().month,
          day: bitcoinStub().day,
          updated: bitcoinStub().updated,
          bpi_usd: bitcoinStub().bpi_usd,
          bpi_euro: bitcoinStub().bpi_euro
        }]
        bitcoins = await bitcoinsService.createHistoricData();
      })

      test('then it should call bitcoinsService', () => {
        expect(bitcoinsService.createHistoricData).toHaveBeenCalled();
      })
    })
  })

  describe('getBitcoinExists', () => {
    describe('when getBitcoinExists is called', () => {
      let bitcoin: Bitcoin;
      let createBitcoinDto: CreateBitcoinDto;

      beforeEach(async () => {
        createBitcoinDto = {
          year: bitcoinStub().year,
          month: bitcoinStub().month,
          day: bitcoinStub().day,
          updated: bitcoinStub().updated,
          bpi_usd: bitcoinStub().bpi_usd,
          bpi_euro: bitcoinStub().bpi_euro
        }
        bitcoin = await bitcoinsService.getBitcoinExists(createBitcoinDto);
      })

      test('then it should call bitcoinsService', () => {
        expect(bitcoinsService.getBitcoinExists).toHaveBeenCalledWith(createBitcoinDto);
      })
    })
  })

   describe('getTopBitcoin', () => {
    describe('when getTopBitcoin is called', () => {
      let bitcoin: Bitcoin;
      let createBitcoinDto: CreateBitcoinDto;

      beforeEach(async () => {
        createBitcoinDto = {
          year: bitcoinStub().year,
          month: bitcoinStub().month,
          day: bitcoinStub().day,
          updated: bitcoinStub().updated,
          bpi_usd: bitcoinStub().bpi_usd,
          bpi_euro: bitcoinStub().bpi_euro
        }
        bitcoin = await bitcoinsService.getTopBitcoin();
      })

      test('then it should call bitcoinsService', () => {
        expect(bitcoinsService.getTopBitcoin).toHaveBeenCalled;
      })
    })
  })


});
