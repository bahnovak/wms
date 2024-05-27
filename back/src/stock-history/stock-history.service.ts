import { Injectable } from '@nestjs/common';
import { CreateStockHistoryDto } from './dto/create-stock-history.dto';
import { UpdateStockHistoryDto } from './dto/update-stock-history.dto';
import { StockHistory } from './entities/stock-history.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class StockHistoryService {
  constructor(
    @InjectRepository(StockHistory)
    private readonly stockHistoryRepository: Repository<StockHistory>,
  ) {}
  create(createStockHistoryDto: CreateStockHistoryDto) {
    return 'This action adds a new stockHistory';
  }

  async findAll(paginationQueryDto: PaginationQueryDto) {
    const history = await this.stockHistoryRepository
      .createQueryBuilder('stockHistory')
      .leftJoinAndSelect('stockHistory.storageProduct', 'storageProduct')
      .leftJoinAndSelect('storageProduct.product', 'product')
      .leftJoinAndSelect('storageProduct.storage', 'storage')
      .leftJoinAndSelect('stockHistory.user', 'user')
      .skip(paginationQueryDto.offset)
      .take(paginationQueryDto.limit)
      .orderBy('stockHistory.created_at', 'DESC')
      .getManyAndCount();
    return history;
  }

  findOne(id: number) {
    return `This action returns a #${id} stockHistory`;
  }

  update(id: number, updateStockHistoryDto: UpdateStockHistoryDto) {
    return `This action updates a #${id} stockHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} stockHistory`;
  }
}
