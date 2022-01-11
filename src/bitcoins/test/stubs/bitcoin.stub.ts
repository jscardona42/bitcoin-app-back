import { Bitcoin } from "src/bitcoins/schemas/bitcoin.schema"

export const bitcoinStub = (): Bitcoin => {
    return {
        year: "0",
        month: "0",
        day: "0",
        updated: new Date("2022-01-11T02:48:24.953Z"),
        bpi_usd: { code: "USD", rate: 0 },
        bpi_euro: { code: "EUR", rate: 0 }
    }
}