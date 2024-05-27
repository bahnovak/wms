import { IsInt, IsNotEmpty, IsPositive, Min } from 'class-validator';

class PositionDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
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

  @IsNotEmpty()
  products: PositionDto[];
}
