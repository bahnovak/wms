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

  @Column('decimal', { default: 0.0, precision: 5, scale: 2 })
  purchasePrice: number;

  @OneToMany(() => OrderPosition, (op) => op.product)
  orderPositions: OrderPosition[];

  @OneToOne(() => StorageProduct, (sp) => sp.product)
  storageProduct: StorageProduct;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
