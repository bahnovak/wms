import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { StorageProduct } from 'src/storage_products/entities/storage_product.entity';
import { Storage } from 'src/storages/entities/storage.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(StorageProduct)
    private readonly storageProductRepository: Repository<StorageProduct>,
    @InjectRepository(Storage)
    private readonly storageRepository: Repository<Storage>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .insert()
      .values({
        name: createProductDto.name,
        purchasePrice: createProductDto.price,
      })
      .execute();

    const storage = await this.storageRepository.findBy({
      id: createProductDto.storageId,
    });

    await this.storageProductRepository
      .createQueryBuilder('storageProduct')
      .insert()
      .values({
        product: product.raw[0],
        storage: storage[0],
      })
      .execute();
    return product;
  }

  findAll(paginationQueryDto: PaginationQueryDto) {
    return this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.storageProduct', 'storageProduct')
      .leftJoinAndSelect('storageProduct.storage', 'storage')
      .skip(paginationQueryDto.offset)
      .take(paginationQueryDto.limit)
      .getManyAndCount();
  }

  findOne(id: number) {
    return this.productRepository.find({ where: { id } });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
