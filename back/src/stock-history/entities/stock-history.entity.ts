import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { StorageProduct } from 'src/storage_products/entities/storage_product.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Reason, StockType } from '../enums/reason.enum';

@Entity()
export class StockHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => StorageProduct)
  @JoinColumn()
  storageProduct: StorageProduct;

  @Column('integer', { default: 0 })
  quantity: number;

  @Column({ enum: Reason })
  reason: Reason;

  @Column({ enum: StockType })
  stockType: StockType;

  @Column()
  reference: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date;
}
