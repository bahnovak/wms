import { OrderPosition } from 'src/order_positions/entities/order_position.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: string;

  @OneToMany(() => OrderPosition, (position) => position.order)
  positions: OrderPosition[];
}
