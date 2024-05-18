import { Module } from '@nestjs/common';
import { PurchasePositionsService } from './purchase_positions.service';
import { PurchasePositionsController } from './purchase_positions.controller';
import { PurchasePosition } from './entities/purchase_position.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PurchasePosition])],
  controllers: [PurchasePositionsController],
  providers: [PurchasePositionsService],
})
export class PurchasePositionsModule {}
