import { OrderPosition } from 'src/order_positions/entities/order_position.entity';
import { StorageProduct } from 'src/storage_products/entities/storage_product.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => OrderPosition, (op) => op.product)
  orderPositions: OrderPosition[];

  @OneToOne(() => StorageProduct, (sp) => sp.product)
  storageProduct: StorageProduct;
}
