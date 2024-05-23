import { Injectable } from '@nestjs/common';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Storage } from './entities/storage.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class StoragesService {
  constructor(
    @InjectRepository(Storage)
    private readonly storageRepository: Repository<Storage>,
  ) {}

  async create(createStorageDto: CreateStorageDto) {
    const storage = await this.storageRepository
      .createQueryBuilder('storage')
      .insert()
      .values({
        name: createStorageDto.name,
        floor: createStorageDto.floor,
        room: createStorageDto.room,
      })
      .execute();
    return storage.raw[0];
  }

  async findAll(paginationQueryDto: PaginationQueryDto) {
    const storages = await this.storageRepository
      .createQueryBuilder('storage')
      .leftJoinAndSelect('storage.products', 'storageProduct')
      .leftJoinAndSelect('storageProduct.product', 'product')
      .skip(paginationQueryDto.offset)
      .take(paginationQueryDto.limit)
      .getManyAndCount();
    return storages;
  }

  findOne(id: number) {
    return `This action returns a #${id} storage`;
  }

  update(id: number, updateStorageDto: UpdateStorageDto) {
    return `This action updates a #${id} storage`;
  }

  remove(id: number) {
    return `This action removes a #${id} storage`;
  }
}
