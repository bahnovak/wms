import { CreateUserDto, PaginationQueryDto } from '../dto';
import { ActiveUserData } from '../interfaces';
import { getPagination } from '../utils/pagination';
import api from './index';

export const fetchUsers = async (
  paginationQuery?: PaginationQueryDto,
): Promise<[ActiveUserData[], number]> =>
  api.get(`/users${paginationQuery ? getPagination(paginationQuery) : ''}`);

export const createUser = async (
  data: CreateUserDto,
): Promise<ActiveUserData> => api.post('/authentication/sign-up', data);
