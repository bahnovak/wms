import { Injectable } from '@nestjs/common';
import { CreatePurchasePositionDto } from './dto/create-purchase_position.dto';
import { UpdatePurchasePositionDto } from './dto/update-purchase_position.dto';

@Injectable()
export class PurchasePositionsService {
  create(createPurchasePositionDto: CreatePurchasePositionDto) {
    return 'This action adds a new purchasePosition';
  }

  findAll() {
    return `This action returns all purchasePositions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purchasePosition`;
  }

  update(id: number, updatePurchasePositionDto: UpdatePurchasePositionDto) {
    return `This action updates a #${id} purchasePosition`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchasePosition`;
  }
}
