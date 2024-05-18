import { Test, TestingModule } from '@nestjs/testing';
import { PurchasePositionsService } from './purchase_positions.service';

describe('PurchasePositionsService', () => {
  let service: PurchasePositionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchasePositionsService],
    }).compile();

    service = module.get<PurchasePositionsService>(PurchasePositionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
