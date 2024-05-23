export interface SignInDto {
  email: string;
  password: string;
}

export interface CreateProductDto {
  name: string;
  storageId: number;
  price: number;
}

export interface CreateStorageDto {
  name: string;
  floor: number;
  room: string;
}

export interface CreateSupplierDto {
  name: string;
  company: string;
}

export interface CreateOrderDto {
  supplierId: number;
  address: string;
  products: {
    productId: number;
    quantity: number;
    salesPrice: number;
  }[];
}

export interface PaginationQueryDto {
  limit: number;
  offset: number;
}
