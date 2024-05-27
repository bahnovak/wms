import { IsNotEmpty } from 'class-validator';

export class CreatePurchasePositionDto {
  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  storageId: number;
}
