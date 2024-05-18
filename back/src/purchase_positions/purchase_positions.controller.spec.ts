import { Test, TestingModule } from '@nestjs/testing';
import { PurchasePositionsController } from './purchase_positions.controller';
import { PurchasePositionsService } from './purchase_positions.service';

describe('PurchasePositionsController', () => {
  let controller: PurchasePositionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchasePositionsController],
      providers: [PurchasePositionsService],
    }).compile();

    controller = module.get<PurchasePositionsController>(PurchasePositionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
