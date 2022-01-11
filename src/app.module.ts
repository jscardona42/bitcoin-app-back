import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BitcoinsModule } from './bitcoins/bitcoins.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    BitcoinsModule,
    MongooseModule.forRoot('mongodb://localhost:27017/bitcoinsdb'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }