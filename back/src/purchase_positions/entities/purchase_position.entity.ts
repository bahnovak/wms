import { Purchase } from 'src/purchases/entities/purchase.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PurchasePosition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Purchase, (purchase) => purchase.positions)
  purchase: Purchase;
}
