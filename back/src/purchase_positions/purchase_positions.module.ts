import { Module } from '@nestjs/common';
import { PurchasePositionsService } from './purchase_positions.service';
import { PurchasePositionsController } from './purchase_positions.controller';
import { PurchasePosition } from './entities/purchase_position.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockHistory } from 'src/stock-history/entities/stock-history.entity';
import { Purchase } from 'src/purchases/entities/purchase.entity';
import { StorageProduct } from 'src/storage_products/entities/storage_product.entity';
import { Storage } from 'src/storages/entities/storage.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchasePosition,
      Purchase,
      StockHistory,
      StorageProduct,
      Storage,
      User,
    ]),
  ],
  controllers: [PurchasePositionsController],
  providers: [PurchasePositionsService],
})
export class PurchasePositionsModule {}
