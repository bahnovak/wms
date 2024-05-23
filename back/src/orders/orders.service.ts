import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Supplier } from 'src/suppliers/entities/supplier.entity';
import { OrderPosition } from 'src/order_positions/entities/order_position.entity';
import { Product } from 'src/products/entities/product.entity';
import { StorageProduct } from 'src/storage_products/entities/storage_product.entity';
import { Status } from './enums/status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectRepository(OrderPosition)
    private readonly orderPositionRepository: Repository<OrderPosition>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(StorageProduct)
    private readonly storageProductRepository: Repository<StorageProduct>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const [, count] = await this.orderRepository.findAndCount();

    const supplier = await this.supplierRepository.findBy({
      id: createOrderDto.supplierId,
    });

    const products = await this.productRepository.findBy({
      id: In(createOrderDto.products.map((p) => p.productId)),
    });

    const order = await this.orderRepository
      .createQueryBuilder('order')
      .insert()
      .values({
        number: `A00${count + 1}`,
        supplier: supplier[0],
        address: createOrderDto.address,
      })
      .execute();

    await this.orderPositionRepository
      .createQueryBuilder('orderPosition')
      .insert()
      .values(
        createOrderDto.products.map((product) => ({
          product: products.find((p) => p.id === product.productId),
          order: order.raw[0],
          quantity: product.quantity,
          salesPrice: product.salesPrice,
        })),
      )
      .execute();
    return order.raw[0];
  }

  async findAll(paginationQueryDto: PaginationQueryDto) {
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.positions', 'orderPosition')
      .leftJoinAndSelect('order.supplier', 'supplier')
      .leftJoinAndSelect('orderPosition.product', 'product')
      .skip(paginationQueryDto.offset)
      .take(paginationQueryDto.limit)
      .getManyAndCount();
    return orders;
  }

  async findOne(id: number) {
    const order = await this.orderPositionRepository.findBy({
      id,
    });

    return order;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async approve(id: number) {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.positions', 'orderPosition')
      .leftJoinAndSelect('orderPosition.product', 'product')
      .where({ id })
      .getOne();

    const storageProducts = await this.storageProductRepository.find({
      where: {
        product: In(order.positions.map((p) => p.product.id)),
      },
      relations: {
        product: true,
      },
    });

    const isAvaliableStock = order.positions.every((position) => {
      const storageProduct = storageProducts.find(
        (sp) => sp.product.id === position.product.id,
      );

      return (
        storageProduct.stock - storageProduct.reserved - position.quantity >= 0
      );
    });

    if (!isAvaliableStock)
      throw new HttpException('Not enough products', HttpStatus.BAD_REQUEST);

    await this.storageProductRepository.save(
      storageProducts.map((sp) => {
        const position = order.positions.find(
          (p) => p.product.id === sp.product.id,
        );
        sp.reserved += position.quantity;
        return sp;
      }),
    );

    order.status = Status.Open;
    this.orderRepository.save(order);

    return isAvaliableStock;
  }

  async close(id: number) {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.positions', 'orderPosition')
      .leftJoinAndSelect('orderPosition.product', 'product')
      .where({ id })
      .getOne();

    if (order.status === Status.Open) {
      const storageProducts = await this.storageProductRepository.find({
        where: {
          product: In(order.positions.map((p) => p.product.id)),
        },
        relations: {
          product: true,
        },
      });

      await this.storageProductRepository.save(
        storageProducts.map((sp) => {
          const position = order.positions.find(
            (p) => p.product.id === sp.product.id,
          );
          sp.reserved -= position.quantity;
          return sp;
        }),
      );
    }

    order.status = Status.Closed;
    this.orderRepository.save(order);

    return order;
  }

  async complete(id: number) {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.positions', 'orderPosition')
      .leftJoinAndSelect('orderPosition.product', 'product')
      .where({ id })
      .getOne();

    const storageProducts = await this.storageProductRepository.find({
      where: {
        product: In(order.positions.map((p) => p.product.id)),
      },
      relations: {
        product: true,
      },
    });

    await this.storageProductRepository.save(
      storageProducts.map((sp) => {
        const position = order.positions.find(
          (p) => p.product.id === sp.product.id,
        );
        sp.reserved -= position.quantity;
        sp.stock -= position.quantity;
        return sp;
      }),
    );

    order.status = Status.Completed;
    this.orderRepository.save(order);

    return order;
  }
}
