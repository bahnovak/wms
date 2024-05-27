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
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { StockHistory } from 'src/stock-history/entities/stock-history.entity';
import { Reason, StockType } from 'src/stock-history/enums/reason.enum';
import { User } from 'src/users/entities/user.entity';

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
    @InjectRepository(StockHistory)
    private readonly stockHistoryRepository: Repository<StockHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private getGroupedStorageProducts(sp: StorageProduct[]) {
    return sp.reduce((acc, sp) => {
      (acc[sp.product.id] = acc[sp.product.id] || []).push(sp);

      return acc;
    }, {});
  }

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
      .orderBy('order.created_at', 'DESC')
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

  async remove(id: number) {
    return;
  }

  async approve(id: number, user: ActiveUserData) {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.positions', 'orderPosition')
      .leftJoinAndSelect('orderPosition.product', 'product')
      .where({ id })
      .getOne();

    const activeUser = await this.userRepository.findOneBy({
      id: user.sub,
    });

    const storageProducts = await this.storageProductRepository.find({
      where: {
        product: In(order.positions.map((p) => p.product.id)),
      },
      relations: {
        product: true,
      },
    });

    const groupedStorageProducts =
      this.getGroupedStorageProducts(storageProducts);

    const isAvaliableStock = order.positions.every((position) => {
      const products = groupedStorageProducts[
        `${position.product.id}`
      ] as StorageProduct[];

      const { totalStock, totalReserved } = products.reduce(
        (
          acc: { totalStock: number; totalReserved: number },
          p: StorageProduct,
        ) => {
          acc.totalStock += p.stock;
          acc.totalReserved += p.reserved;
          return acc;
        },
        {
          totalStock: 0,
          totalReserved: 0,
        },
      );

      return totalStock - totalReserved - position.quantity >= 0;
    });

    if (!isAvaliableStock)
      throw new HttpException('Not enough products', HttpStatus.BAD_REQUEST);

    const storageProductsForUpdate: {
      count: number;
      storageProduct: StorageProduct;
    }[] = [];
    order.positions.forEach((position) => {
      const spGroup = groupedStorageProducts[
        `${position.product.id}`
      ] as StorageProduct[];

      let unallocatedStock = position.quantity;

      spGroup.forEach((spg) => {
        if (unallocatedStock > 0) {
          const avaliableStock = spg.stock - spg.reserved;
          if (avaliableStock === 0) return;
          if (unallocatedStock >= avaliableStock) {
            unallocatedStock -= avaliableStock;
            storageProductsForUpdate.push({
              count: avaliableStock,
              storageProduct: spg,
            });
          } else {
            storageProductsForUpdate.push({
              count: unallocatedStock,
              storageProduct: spg,
            });
            unallocatedStock -= unallocatedStock;
          }
        }
      });
    });

    await this.storageProductRepository.save(
      storageProductsForUpdate.map((sp) => {
        sp.storageProduct.reserved += sp.count;
        return sp.storageProduct;
      }),
    );

    this.stockHistoryRepository.save(
      storageProductsForUpdate.map((sp) => {
        return {
          user: activeUser,
          quantity: sp.count,
          reason: Reason.Reserve,
          stockType: StockType.Reserve,
          storageProduct: sp.storageProduct,
          reference: order.number,
        };
      }),
    );

    order.status = Status.Open;
    this.orderRepository.save(order);

    return isAvaliableStock;
  }

  async close(id: number, user: ActiveUserData) {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .where({ id })
      .getOne();

    const activeUser = await this.userRepository.findOneBy({
      id: user.sub,
    });

    if (order.status === Status.Open) {
      const historyByOrder = await this.stockHistoryRepository.find({
        where: {
          reference: order.number,
        },
        relations: {
          storageProduct: true,
        },
      });

      await this.storageProductRepository.save(
        historyByOrder.map((operation) => {
          operation.storageProduct.reserved -= operation.quantity;
          return operation.storageProduct;
        }),
      );

      this.stockHistoryRepository.save(
        historyByOrder.map((operation) => {
          return {
            user: activeUser,
            quantity: -operation.quantity,
            reason: Reason.OrderClose,
            stockType: StockType.Reserve,
            storageProduct: operation.storageProduct,
            reference: order.number,
          };
        }),
      );
    }

    order.status = Status.Closed;
    this.orderRepository.save(order);

    return order;
  }

  async complete(id: number, user: ActiveUserData) {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.positions', 'orderPosition')
      .leftJoinAndSelect('orderPosition.product', 'product')
      .where({ id })
      .getOne();

    const activeUser = await this.userRepository.findOneBy({
      id: user.sub,
    });

    const historyByOrder = await this.stockHistoryRepository.find({
      where: {
        reference: order.number,
      },
      relations: {
        storageProduct: true,
      },
    });

    await this.storageProductRepository.save(
      historyByOrder.map((operation) => {
        operation.storageProduct.reserved -= operation.quantity;
        operation.storageProduct.stock -= operation.quantity;
        return operation.storageProduct;
      }),
    );

    this.stockHistoryRepository.save(
      historyByOrder
        .map((operation) => {
          return [
            {
              user: activeUser,
              quantity: -operation.quantity,
              reason: Reason.Order,
              stockType: StockType.Reserve,
              storageProduct: operation.storageProduct,
              reference: order.number,
            },
            {
              user: activeUser,
              quantity: -operation.quantity,
              reason: Reason.Order,
              stockType: StockType.Stock,
              storageProduct: operation.storageProduct,
              reference: order.number,
            },
          ];
        })
        .flat(),
    );

    order.status = Status.Completed;
    this.orderRepository.save(order);

    return order;
  }
}
