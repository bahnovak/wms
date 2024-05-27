import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderPosition } from 'src/order_positions/entities/order_position.entity';
import { Product } from 'src/products/entities/product.entity';
import { Supplier } from 'src/suppliers/entities/supplier.entity';
import { StorageProduct } from 'src/storage_products/entities/storage_product.entity';
import { StockHistory } from 'src/stock-history/entities/stock-history.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      Product,
      Supplier,
      OrderPosition,
      StorageProduct,
      StockHistory,
      User,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
