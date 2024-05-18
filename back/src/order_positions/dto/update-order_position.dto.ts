import { PartialType } from '@nestjs/swagger';
import { CreateOrderPositionDto } from './create-order_position.dto';

export class UpdateOrderPositionDto extends PartialType(CreateOrderPositionDto) {}
