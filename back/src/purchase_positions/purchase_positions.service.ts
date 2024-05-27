import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePurchasePositionDto } from './dto/create-purchase_position.dto';
import { UpdatePurchasePositionDto } from './dto/update-purchase_position.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchasePosition } from './entities/purchase_position.entity';
import { In, Repository } from 'typeorm';
import { Purchase } from 'src/purchases/entities/purchase.entity';
import { StorageProduct } from 'src/storage_products/entities/storage_product.entity';
import { Storage } from 'src/storages/entities/storage.entity';
import { BookPurchasePositionsDto } from './dto/book-putchase_positions.dto';
import { StockHistory } from 'src/stock-history/entities/stock-history.entity';
import { User } from 'src/users/entities/user.entity';
import { Reason, StockType } from 'src/stock-history/enums/reason.enum';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { PurchaseStatus } from 'src/purchases/enums/purchase-status.enums';

@Injectable()
export class PurchasePositionsService {
  constructor(
    @InjectRepository(PurchasePosition)
    private readonly purchasePositionRepository: Repository<PurchasePosition>,
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
    @InjectRepository(StorageProduct)
    private readonly storageProductRepository: Repository<StorageProduct>,
    @InjectRepository(Storage)
    private readonly storageRepository: Repository<Storage>,
    @InjectRepository(StockHistory)
    private readonly stockHistoryRepository: Repository<StockHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  create(createPurchasePositionDto: CreatePurchasePositionDto) {
    return 'This action adds a new purchasePosition';
  }

  async findAll() {
    const positions = await this.purchasePositionRepository
      .createQueryBuilder('purchasePosition')
      .leftJoinAndSelect('purchasePosition.purchase', 'purchase')
      .leftJoinAndSelect('purchasePosition.product', 'product')
      .where('purchase.status = :status', { status: PurchaseStatus.Open })
      .andWhere('purchasePosition.expected > purchasePosition.delivered')
      .getManyAndCount();

    return positions;
  }

  findOne(id: number) {
    return `This action returns a #${id} purchasePosition`;
  }

  update(id: number, updatePurchasePositionDto: UpdatePurchasePositionDto) {
    return `This action updates a #${id} purchasePosition`;
  }

  async bookMany(
    bookPurchasePositionsDto: BookPurchasePositionsDto,
    user: ActiveUserData,
  ) {
    const { storageId, positions } = bookPurchasePositionsDto;
    const activeUser = await this.userRepository.findOneBy({
      id: user.sub,
    });
    const purchasePositions = await this.purchasePositionRepository.find({
      where: {
        id: In(positions.map((p) => p.positionId)),
      },
      relations: { product: true, purchase: true },
    });

    if (purchasePositions.length !== positions.length)
      throw new HttpException('Incorrect positions', HttpStatus.BAD_REQUEST);

    const isValid = purchasePositions.every((p) => {
      return (
        p.expected -
          p.delivered -
          positions.find((pos) => pos.positionId === p.id).quantity >=
        0
      );
    });
    if (!isValid)
      throw new HttpException('Incorrect quantity', HttpStatus.BAD_REQUEST);

    await this.purchasePositionRepository.save(
      purchasePositions.map((pp) => {
        pp.delivered += positions.find((p) => p.positionId === pp.id).quantity;
        return pp;
      }),
    );

    const purchase = await this.purchaseRepository.findOne({
      where: {
        id: purchasePositions[0].purchase.id,
      },
      relations: {
        positions: true,
      },
    });

    const storage = await this.storageRepository.findOneBy({
      id: storageId,
    });

    const storageProducts = await this.storageProductRepository
      .createQueryBuilder('storageProduct')
      .leftJoinAndSelect('storageProduct.product', 'product')
      .leftJoinAndSelect('storageProduct.storage', 'storage')
      .where('storageProduct.product.id IN (:...ids)', {
        ids: purchasePositions.map((pp) => pp.product.id),
      })
      .andWhere('storageProduct.storage.id = :storageId ', {
        storageId: storage.id,
      })
      .getMany();

    const updatedStorageProducts = await this.storageProductRepository.save(
      purchasePositions.map((p) => {
        const sp = storageProducts.find((sp) => sp.product.id === p.product.id);
        if (sp) {
          sp.stock += positions.find((pos) => pos.positionId === p.id).quantity;
          return sp;
        } else {
          return {
            storage,
            product: p.product,
            stock: positions.find((pos) => pos.positionId === p.id).quantity,
          };
        }
      }),
    );

    this.stockHistoryRepository.save(
      updatedStorageProducts.map((sp) => {
        const quantity = positions.find((p) => {
          const up = purchasePositions.find((upp) => upp.id === p.positionId);
          return up.product.id === sp.product.id;
        }).quantity;

        return {
          user: activeUser,
          quantity,
          reason: Reason.Purchase,
          stockType: StockType.Stock,
          storageProduct: sp,
          reference: purchase.number,
        };
      }),
    );

    const isDeliveredPurchase = purchase.positions.every(
      (pfc) => pfc.expected === pfc.delivered,
    );

    if (isDeliveredPurchase) {
      purchase.status = PurchaseStatus.Delivered;
      this.purchaseRepository.save(purchase);
    }

    return;
  }

  remove(id: number) {
    return `This action removes a #${id} purchasePosition`;
  }
}
