import { StorageProduct } from 'src/storage_products/entities/storage_product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Storage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => StorageProduct, (sp) => sp.storage)
  products: StorageProduct[];
}
