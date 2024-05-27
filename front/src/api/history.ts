import { PaginationQueryDto } from '../dto';
import { IHistory } from '../interfaces';
import { getPagination } from '../utils/pagination';
import api from './index';

export const fetchHistory = async (
  paginationQuery?: PaginationQueryDto,
): Promise<[IHistory[], number]> =>
  api.get(
    `/stock-history${paginationQuery ? getPagination(paginationQuery) : ''}`,
  );
