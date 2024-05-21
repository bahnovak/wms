import { CreateProductDto, PaginationQueryDto } from '../dto';
import { IProduct } from '../interfaces';
import { getPagination } from '../utils/pagination';
import api from './index';

export const fetchProducts = async (
  paginationQuery?: PaginationQueryDto,
): Promise<[IProduct[], number]> =>
  api.get(`/products${paginationQuery ? getPagination(paginationQuery) : ''}`);

export const createProduct = async (
  data: CreateProductDto,
): Promise<IProduct> => api.post('/products', data);
