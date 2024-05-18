import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderPositionsService } from './order_positions.service';
import { CreateOrderPositionDto } from './dto/create-order_position.dto';
import { UpdateOrderPositionDto } from './dto/update-order_position.dto';

@Controller('order-positions')
export class OrderPositionsController {
  constructor(private readonly orderPositionsService: OrderPositionsService) {}

  @Post()
  create(@Body() createOrderPositionDto: CreateOrderPositionDto) {
    return this.orderPositionsService.create(createOrderPositionDto);
  }

  @Get()
  findAll() {
    return this.orderPositionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderPositionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderPositionDto: UpdateOrderPositionDto) {
    return this.orderPositionsService.update(+id, updateOrderPositionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderPositionsService.remove(+id);
  }
}
