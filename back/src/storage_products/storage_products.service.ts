import { Injectable } from '@nestjs/common';
import { CreateStorageProductDto } from './dto/create-storage_product.dto';
import { UpdateStorageProductDto } from './dto/update-storage_product.dto';

@Injectable()
export class StorageProductsService {
  create(createStorageProductDto: CreateStorageProductDto) {
    return 'This action adds a new storageProduct';
  }

  findAll() {
    return `This action returns all storageProducts`;
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
