import { Module } from '@nestjs/common';
import { StockHistoryService } from './stock-history.service';
import { StockHistoryController } from './stock-history.controller';
import { StockHistory } from './entities/stock-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([StockHistory])],
  controllers: [StockHistoryController],
  providers: [StockHistoryService],
})
export class StockHistoryModule {}
