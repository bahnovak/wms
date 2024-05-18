import { Test, TestingModule } from '@nestjs/testing';
import { StorageProductsService } from './storage_products.service';

describe('StorageProductsService', () => {
  let service: StorageProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorageProductsService],
    }).compile();

    service = module.get<StorageProductsService>(StorageProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
