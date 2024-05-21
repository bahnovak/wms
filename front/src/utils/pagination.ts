import { PaginationQueryDto } from '../dto';

export const getPagination = (paginationQuery: PaginationQueryDto) =>
  `?offset=${paginationQuery.offset}&limit=${paginationQuery.limit}`;
