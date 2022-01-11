import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Currency } from './currency.schema';

export type UserDocument = Bitcoin & Document;

@Schema({ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } })
export class Bitcoin {
    @Prop({ required: true })
    year: string;

    @Prop({ required: true })
    month: string;

    @Prop({ required: true })
    day: string;

    @Prop({ required: true })
    updated: Date

    @Prop({ required: true })
    bpi_euro: Currency

    @Prop({ required: true })
    bpi_usd: Currency

    @Prop()
    bpi_peso_col?: Currency

}

export const BitcoinSchema = SchemaFactory.createForClass(Bitcoin);