import { PartialType } from '@nestjs/swagger';
import { CreatePurchasePositionDto } from './create-purchase_position.dto';

export class UpdatePurchasePositionDto extends PartialType(CreatePurchasePositionDto) {}
