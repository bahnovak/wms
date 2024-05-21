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

export interface PaginationQueryDto {
  limit: number;
  offset: number;
}
