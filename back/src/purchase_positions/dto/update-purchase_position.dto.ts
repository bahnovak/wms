import { PartialType } from '@nestjs/swagger';
import { CreatePurchasePositionDto } from './create-purchase_position.dto';
import { IsOptional } from 'class-validator';

export class UpdatePurchasePositionDto extends PartialType(
  CreatePurchasePositionDto,
) {
  @IsOptional()
  positionId: number;
}
