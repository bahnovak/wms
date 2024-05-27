import { CreatePurchaseDto, PaginationQueryDto } from '../dto';
import { IPurchase } from '../interfaces';
import { getPagination } from '../utils/pagination';
import api from './index';

export const fetchPurchases = async (
  paginationQuery?: PaginationQueryDto,
): Promise<[IPurchase[], number]> =>
  api.get(`/purchases${paginationQuery ? getPagination(paginationQuery) : ''}`);

export const createPurchase = async (
  data: CreatePurchaseDto,
): Promise<IPurchase> => api.post('/purchases', data);
