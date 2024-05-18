import { Module } from '@nestjs/common';
import { OrderPositionsService } from './order_positions.service';
import { OrderPositionsController } from './order_positions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderPosition } from './entities/order_position.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderPosition])],
  controllers: [OrderPositionsController],
  providers: [OrderPositionsService],
})
export class OrderPositionsModule {}
