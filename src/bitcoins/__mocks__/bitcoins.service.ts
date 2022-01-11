import { bitcoinStub } from "../test/stubs/bitcoin.stub";

export const BitcoinsService = jest.fn().mockReturnValue({
    getBitcoins: jest.fn().mockResolvedValue([bitcoinStub()]),
    getLastDataBitcoin: jest.fn().mockResolvedValue(bitcoinStub()),
    getBitcoinExists: jest.fn().mockResolvedValue(bitcoinStub()),
    getTopBitcoin: jest.fn().mockResolvedValue(bitcoinStub()),
    createBitcoin: jest.fn().mockResolvedValue(bitcoinStub()),
    createHistoricData: jest.fn().mockResolvedValue([bitcoinStub()]),
})