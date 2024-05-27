import { OrderPosition } from 'src/order_positions/entities/order_position.entity';
import { StorageProduct } from 'src/storage_products/entities/storage_product.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { default: 0.0, precision: 19, scale: 2 })
  purchasePrice: number;

  @OneToMany(() => OrderPosition, (op) => op.product)
  orderPositions: OrderPosition[];

  @OneToMany(() => StorageProduct, (sp) => sp.product)
  storageProducts: StorageProduct;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date;
}
