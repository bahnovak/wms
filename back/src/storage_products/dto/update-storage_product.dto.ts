import { PartialType } from '@nestjs/swagger';
import { CreateStorageProductDto } from './create-storage_product.dto';

export class UpdateStorageProductDto extends PartialType(CreateStorageProductDto) {}
