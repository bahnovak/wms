import { Injectable } from '@nestjs/common';
import { CreateStockHistoryDto } from './dto/create-stock-history.dto';
import { UpdateStockHistoryDto } from './dto/update-stock-history.dto';
import { StockHistory } from './entities/stock-history.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StockHistoryService {
  constructor(
    @InjectRepository(StockHistory)
    private readonly orderRepository: Repository<StockHistory>,
  ){}
  create(createStockHistoryDto: CreateStockHistoryDto) {
    return 'This action adds a new stockHistory';
  }

  findAll() {
    return `This action returns all stockHistory`;
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
