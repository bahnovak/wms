import { CreateOrderDto, PaginationQueryDto } from '../dto';
import { IOrder } from '../interfaces';
import { getPagination } from '../utils/pagination';
import api from './index';

export const fetchOrders = async (
  paginationQuery?: PaginationQueryDto,
): Promise<[IOrder[], number]> =>
  api.get(`/orders${paginationQuery ? getPagination(paginationQuery) : ''}`);

export const createOrder = async (data: CreateOrderDto): Promise<IOrder> =>
  api.post('/orders', data);

export const approveOrder = async (id: number): Promise<IOrder> =>
  api.get(`/orders/approve/${id}`);

export const closeOrder = async (id: number): Promise<IOrder> =>
  api.get(`/orders/close/${id}`);

export const completeOrder = async (id: number): Promise<IOrder> =>
  api.get(`/orders/complete/${id}`);
