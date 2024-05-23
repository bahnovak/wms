import { IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  supplierId: number;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  products: {
    productId: number;
    quantity: number;
    salesPrice: number;
  }[];
}
