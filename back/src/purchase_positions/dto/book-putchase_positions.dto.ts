import { IsInt, IsNotEmpty, Min } from 'class-validator';

class PositionDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;

  @IsNotEmpty()
  @Min(1)
  @IsInt()
  positionId: number;
}

export class BookPurchasePositionsDto {
  @IsNotEmpty()
  @Min(1)
  @IsInt()
  storageId: number;

  @IsNotEmpty()
  positions: PositionDto[];
}
