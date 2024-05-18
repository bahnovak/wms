import { Injectable } from '@nestjs/common';
import { CreateOrderPositionDto } from './dto/create-order_position.dto';
import { UpdateOrderPositionDto } from './dto/update-order_position.dto';

@Injectable()
export class OrderPositionsService {
  create(createOrderPositionDto: CreateOrderPositionDto) {
    return 'This action adds a new orderPosition';
  }

  findAll() {
    return `This action returns all orderPositions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderPosition`;
  }

  update(id: number, updateOrderPositionDto: UpdateOrderPositionDto) {
    return `This action updates a #${id} orderPosition`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderPosition`;
  }
}
