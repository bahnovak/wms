import { Injectable } from '@nestjs/common';
import { CreateStorageProductDto } from './dto/create-storage_product.dto';
import { UpdateStorageProductDto } from './dto/update-storage_product.dto';
import { StorageProduct } from './entities/storage_product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StorageProductsService {
  constructor(
    @InjectRepository(StorageProduct)
    private readonly storageProductRepository: Repository<StorageProduct>,
  ) {}

  create(createStorageProductDto: CreateStorageProductDto) {
    return 'This action adds a new storageProduct';
  }

  findAll() {
    return this.storageProductRepository.findAndCount();
  }

  findOne(id: number) {
    return `This action returns a #${id} storageProduct`;
  }

  update(id: number, updateStorageProductDto: UpdateStorageProductDto) {
    return `This action updates a #${id} storageProduct`;
  }

  remove(id: number) {
    return `This action removes a #${id} storageProduct`;
  }
}
