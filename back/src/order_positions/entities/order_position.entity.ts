import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class OrderPosition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { default: 0.0, precision: 19, scale: 2 })
  salesPrice: number;

  @Column('integer', { default: 0 })
  quantity: number;

  @ManyToOne(() => Order, (order) => order.positions)
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderPositions)
  product: Product;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date;
}
