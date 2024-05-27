import { Injectable } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { In, Repository } from 'typeorm';
import { Purchase } from './entities/purchase.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Product } from 'src/products/entities/product.entity';
import { PurchasePosition } from 'src/purchase_positions/entities/purchase_position.entity';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(PurchasePosition)
    private readonly purchasePositionRepository: Repository<PurchasePosition>,
  ) {}
  async create(createPurchaseDto: CreatePurchaseDto) {
    const [, count] = await this.purchaseRepository.findAndCount();

    const products = await this.productRepository.findBy({
      id: In(createPurchaseDto.products.map((p) => p.productId)),
    });

    const purchase = await this.purchaseRepository
      .createQueryBuilder('purchase')
      .insert()
      .values({
        number: `P00${count + 1}`,
      })
      .execute();

    await this.purchasePositionRepository
      .createQueryBuilder('purchasePosition')
      .insert()
      .values(
        createPurchaseDto.products.map((product) => ({
          product: products.find((p) => p.id === product.productId),
          purchase: purchase.raw[0],
          expected: product.quantity,
        })),
      )
      .execute();

    return purchase.raw[0];
  }

  async findAll(paginationQueryDto: PaginationQueryDto) {
    const purchases = await this.purchaseRepository
      .createQueryBuilder('purchase')
      .leftJoinAndSelect('purchase.positions', 'purchasePosition')
      .leftJoinAndSelect('purchasePosition.product', 'product')
      .skip(paginationQueryDto.offset)
      .take(paginationQueryDto.limit)
      .orderBy('purchase.created_at', 'DESC')
      .getManyAndCount();
    return purchases;
  }

  findOne(id: number) {
    return `This action returns a #${id} purchase`;
  }

  update(id: number, updatePurchaseDto: UpdatePurchaseDto) {
    return `This action updates a #${id} purchase`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchase`;
  }
}
