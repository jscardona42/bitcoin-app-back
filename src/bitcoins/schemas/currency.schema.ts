import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export class Currency {
    @Prop({ required: true })
    rate: number;

    @Prop({ required: true })
    code: string;
}

export const CurrenciySchema = SchemaFactory.createForClass(Currency);