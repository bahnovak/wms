import { Module } from '@nestjs/common';
import { StorageProductsService } from './storage_products.service';
import { StorageProductsController } from './storage_products.controller';
import { StorageProduct } from './entities/storage_product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([StorageProduct])],
  controllers: [StorageProductsController],
  providers: [StorageProductsService],
})
export class StorageProductsModule {}
