import { CreateSupplierDto, PaginationQueryDto } from '../dto';
import { ISupplier } from '../interfaces';
import { getPagination } from '../utils/pagination';
import api from './index';

export const fetchSuppliers = async (
  paginationQuery?: PaginationQueryDto,
): Promise<[ISupplier[], number]> =>
  api.get(`/suppliers${paginationQuery ? getPagination(paginationQuery) : ''}`);

export const createSupplier = async (
  data: CreateSupplierDto,
): Promise<ISupplier> => api.post('/suppliers', data);
