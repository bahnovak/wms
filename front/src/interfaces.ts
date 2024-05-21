import { Role } from './enums';

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
