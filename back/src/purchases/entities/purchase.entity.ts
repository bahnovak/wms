import { PurchasePosition } from 'src/purchase_positions/entities/purchase_position.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => PurchasePosition, (p) => p.purchase)
  positions: PurchasePosition[];
}
