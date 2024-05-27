import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

class Position {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}

export class CreatePurchaseDto {
  @IsNotEmpty()
  products: Position[];
}
