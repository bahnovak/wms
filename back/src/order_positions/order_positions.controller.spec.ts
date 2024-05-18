import { Test, TestingModule } from '@nestjs/testing';
import { OrderPositionsController } from './order_positions.controller';
import { OrderPositionsService } from './order_positions.service';

describe('OrderPositionsController', () => {
  let controller: OrderPositionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderPositionsController],
      providers: [OrderPositionsService],
    }).compile();

    controller = module.get<OrderPositionsController>(OrderPositionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
