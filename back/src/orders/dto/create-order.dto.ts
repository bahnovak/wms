import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsPositive,
  Min,
  ValidateNested,
} from 'class-validator';

class PositionDto {
  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  quantity: number;

  @IsNotEmpty()
  @Min(1)
  @IsInt()
  productId: number;

  @IsNotEmpty()
  @IsPositive()
  salesPrice: number;
}

export class CreateOrderDto {
  @IsInt()
  @IsNotEmpty()
  supplierId: number;

  @IsNotEmpty()
  address: string;

  @IsArray()
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => PositionDto)
  products: PositionDto[];
}
