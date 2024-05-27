import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  storageId: number;

  @IsNotEmpty()
  @IsPositive()
  price: number;
}
