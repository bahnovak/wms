import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StorageProductsService } from './storage_products.service';
import { CreateStorageProductDto } from './dto/create-storage_product.dto';
import { UpdateStorageProductDto } from './dto/update-storage_product.dto';

@Controller('storage-products')
export class StorageProductsController {
  constructor(private readonly storageProductsService: StorageProductsService) {}

  @Post()
  create(@Body() createStorageProductDto: CreateStorageProductDto) {
    return this.storageProductsService.create(createStorageProductDto);
  }

  @Get()
  findAll() {
    return this.storageProductsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storageProductsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStorageProductDto: UpdateStorageProductDto) {
    return this.storageProductsService.update(+id, updateStorageProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storageProductsService.remove(+id);
  }
}
