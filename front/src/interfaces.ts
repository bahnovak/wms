import { OrderStatus, Role } from './enums';

export interface ITokens {
  refreshToken: string;
  accessToken: string;
}

export interface ActiveUserData {
  sub: number;
  email: string;
  role: Role;
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
  storageProduct: IStorageProduct;
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
