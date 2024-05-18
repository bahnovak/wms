import { Test, TestingModule } from '@nestjs/testing';
import { OrderPositionsService } from './order_positions.service';

describe('OrderPositionsService', () => {
  let service: OrderPositionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderPositionsService],
    }).compile();

    service = module.get<OrderPositionsService>(OrderPositionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
