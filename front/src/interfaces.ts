import {
  OperationReason,
  OperationStockType,
  OrderStatus,
  PurchaseStatus,
  Role,
} from './enums';

export interface ITokens {
  refreshToken: string;
  accessToken: string;
}

export interface ActiveUserData {
  id: string;
  sub: number;
  email: string;
  role: Role;
  name: string;
}

export interface IStorageProduct {
  id: number;
  stock: number;
  reserved: number;
  storage: IStorage;
  product: IProduct;
}

export interface IProduct {
  id: number;
  name: string;
  purchasePrice: number;
  storageProducts: IStorageProduct[];
}

export interface ICustomProduct extends IProduct {
  salesPrice: number | '';
  quantity: number | '';
}

export interface ISupplier {
  id: number;
  name: string;
  company: string;
}

export interface IStorage {
  id: number;
  name: string;
  floor: number;
  room: string;
  products: IStorageProduct[];
}

export interface IOrder {
  id: number;
  number: string;
  address: string;
  supplier: ISupplier;
  positions: IOrderPosition[];
  status: OrderStatus;
  created_at: string;
}

export interface IOrderPosition {
  id: number;
  order: IOrder;
  product: IProduct;
  salesPrice: number;
  quantity: number;
}

export interface IHistory {
  id: number;
  user: ActiveUserData;
  storageProduct: IStorageProduct;
  quantity: number;
  reason: OperationReason;
  stockType: OperationStockType;
  reference: string;
  created_at: string;
}

export interface IPurchase {
  id: number;
  status: PurchaseStatus;
  number: string;
  positions: IPurchasePosition[];
  created_at: string;
}

export interface IPurchasePosition {
  id: number;
  purchase: IPurchase;
  expected: number;
  delivered: number;
  product: IProduct;
}
