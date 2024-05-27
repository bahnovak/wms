import { PurchasePosition } from 'src/purchase_positions/entities/purchase_position.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PurchaseStatus } from '../enums/purchase-status.enums';

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: string;

  @OneToMany(() => PurchasePosition, (p) => p.purchase)
  positions: PurchasePosition[];

  @Column({ enum: PurchaseStatus, default: PurchaseStatus.Open })
  status: PurchaseStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date;
}
