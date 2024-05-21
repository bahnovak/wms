import { CreateStorageDto, PaginationQueryDto } from '../dto';
import { IStorage } from '../interfaces';
import { getPagination } from '../utils/pagination';
import api from './index';

export const fetchStorages = async (
  paginationQuery?: PaginationQueryDto,
): Promise<[IStorage[], number]> =>
  api.get(`/storages${paginationQuery ? getPagination(paginationQuery) : ''}`);

export const createStorage = async (
  data: CreateStorageDto,
): Promise<IStorage> => api.post('/storages', data);
