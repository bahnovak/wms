import { Product } from 'src/products/entities/product.entity';
import { Storage } from 'src/storages/entities/storage.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class StorageProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(() => Product, (product) => product.storageProduct)
  @JoinColumn()
  product: Product;

  @ManyToOne(() => Storage, (sp) => sp.products)
  storage: Storage;
}
