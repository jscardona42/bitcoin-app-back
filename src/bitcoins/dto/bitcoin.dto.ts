import { Prop } from "@nestjs/mongoose";

export class CreateCurrencyDto {
    @Prop({ required: true })
    rate: number;

    @Prop({ required: true })
    code: string;
}

export class CreateBitcoinDto {
    @Prop({ required: true })
    year: string;

    @Prop({ required: true })
    month: string;

    @Prop({ required: true })
    day: string;

    @Prop({ required: true })
    updated: Date

    @Prop({ required: true })
    bpi_euro: CreateCurrencyDto

    @Prop({ required: true })
    bpi_usd: CreateCurrencyDto

    @Prop()
    bpi_peso_col?: CreateCurrencyDto
}


