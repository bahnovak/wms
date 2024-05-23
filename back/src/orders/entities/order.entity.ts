import { OrderPosition } from 'src/order_positions/entities/order_position.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from '../enums/status.enum';
import { Supplier } from 'src/suppliers/entities/supplier.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: string;

  @Column({ enum: Status, default: Status.InProcessing })
  status: Status;

  @OneToMany(() => OrderPosition, (position) => position.order)
  positions: OrderPosition[];

  @ManyToOne(() => Supplier, (supplier) => supplier.orders)
  supplier: Supplier;

  @Column()
  address: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date;
}
