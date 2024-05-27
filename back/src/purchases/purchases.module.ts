import { Module } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { Purchase } from './entities/purchase.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { PurchasePosition } from 'src/purchase_positions/entities/purchase_position.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Purchase, Product, PurchasePosition])],
  controllers: [PurchasesController],
  providers: [PurchasesService],
})
export class PurchasesModule {}
