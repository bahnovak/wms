import { Test, TestingModule } from '@nestjs/testing';
import { StorageProductsController } from './storage_products.controller';
import { StorageProductsService } from './storage_products.service';

describe('StorageProductsController', () => {
  let controller: StorageProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StorageProductsController],
      providers: [StorageProductsService],
    }).compile();

    controller = module.get<StorageProductsController>(StorageProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
