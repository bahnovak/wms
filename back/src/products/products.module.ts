import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';
import { StorageProduct } from 'src/storage_products/entities/storage_product.entity';
import { Storage } from 'src/storages/entities/storage.entity';

@Auth(AuthType.Bearer)
@Module({
  imports: [TypeOrmModule.forFeature([Product, StorageProduct, Storage])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
