import { Product } from 'src/products/entities/product.entity';
import { Storage } from 'src/storages/entities/storage.entity';
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

@Entity()
export class StorageProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer', { default: 0 })
  reserved: number;

  @Column('integer', { default: 0 })
  stock: number;

  @ManyToOne(() => Product, (p) => p.storageProducts)
  @JoinColumn()
  product: Product;

  @ManyToOne(() => Storage, (sp) => sp.products)
  storage: Storage;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date;
}
