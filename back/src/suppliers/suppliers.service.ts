import { Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Supplier } from './entities/supplier.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  async create(createSupplierDto: CreateSupplierDto) {
    const supplier = await this.supplierRepository
      .createQueryBuilder('supplier')
      .insert()
      .values({
        name: createSupplierDto.name,
        company: createSupplierDto.company,
      })
      .execute();
    return supplier;
  }

  async findAll(paginationQueryDto: PaginationQueryDto) {
    const suppliers = await this.supplierRepository
      .createQueryBuilder('supplier')
      .skip(paginationQueryDto.offset)
      .take(paginationQueryDto.limit)
      .getManyAndCount();
    return suppliers;
  }

  findOne(id: number) {
    return `This action returns a #${id} supplier`;
  }

  update(id: number, updateSupplierDto: UpdateSupplierDto) {
    return `This action updates a #${id} supplier`;
  }

  remove(id: number) {
    return `This action removes a #${id} supplier`;
  }
}
