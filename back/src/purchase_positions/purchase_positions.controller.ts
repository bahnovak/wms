import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurchasePositionsService } from './purchase_positions.service';
import { CreatePurchasePositionDto } from './dto/create-purchase_position.dto';
import { UpdatePurchasePositionDto } from './dto/update-purchase_position.dto';

@Controller('purchase-positions')
export class PurchasePositionsController {
  constructor(private readonly purchasePositionsService: PurchasePositionsService) {}

  @Post()
  create(@Body() createPurchasePositionDto: CreatePurchasePositionDto) {
    return this.purchasePositionsService.create(createPurchasePositionDto);
  }

  @Get()
  findAll() {
    return this.purchasePositionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchasePositionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurchasePositionDto: UpdatePurchasePositionDto) {
    return this.purchasePositionsService.update(+id, updatePurchasePositionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchasePositionsService.remove(+id);
  }
}
