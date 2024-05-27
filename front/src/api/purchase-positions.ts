import { BookPurchasePositionsDto } from '../dto';
import { IPurchasePosition } from '../interfaces';
import api from './index';

export const bookPurchasePositions = async (
  data: BookPurchasePositionsDto,
): Promise<boolean> => api.post('/purchase-positions/book', data);

export const fetchPurchasePositions = async (): Promise<
  [IPurchasePosition[], number]
> => api.get('/purchase-positions');
