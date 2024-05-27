import { useEffect, useState } from 'react';
import { IHistory } from '../../interfaces';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
} from '@mui/material';

import { Loader } from '../../components/Loader/Loader';
import { fetchHistory } from '../../api/history';
import { customizeStorageName } from '../../utils/storages';
import dayjs from 'dayjs';
import { OperationReason, OperationStockType } from '../../enums';

const reasonMap = {
  [OperationReason.Order]: 'Отгрузка заказа',
  [OperationReason.OrderClose]: 'Отмена заказа',
  [OperationReason.Purchase]: 'Закупка',
  [OperationReason.Reserve]: 'Резервирование под заказ',
};

const stockTypeMap = {
  [OperationStockType.Reserve]: 'Резерв',
  [OperationStockType.Stock]: 'Изменение запаса',
};

export const History = () => {
  const [history, setHistory] = useState<IHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchHistory({
      limit: rowsPerPage,
      offset: page * rowsPerPage,
    }).then((res) => {
      setHistory(res[0]);
      setTotalCount(res[1]);
      setIsLoading(false);
    });
  }, [rowsPerPage, page]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: '80%' }}>
        <Table aria-label="collapsible table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="left">Id</TableCell>
              <TableCell align="left">Название хранилища</TableCell>
              <TableCell>Имя пользователя</TableCell>
              <TableCell>Название продукта</TableCell>
              <TableCell>Причина</TableCell>
              <TableCell>Тип операции</TableCell>
              <TableCell>Количество</TableCell>
              <TableCell>Номер</TableCell>
              <TableCell>Дата операции</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((operation) => (
              <TableRow
                sx={{ '& > *': { borderBottom: 'unset' } }}
                key={operation.id}
              >
                <TableCell component="th" scope="row" align="left">
                  {operation.id}
                </TableCell>
                <TableCell component="th" scope="row">
                  {customizeStorageName(operation.storageProduct.storage)}
                </TableCell>
                <TableCell component="th" scope="row">
                  {operation.user.name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {operation.storageProduct.product.name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {reasonMap[operation.reason]}
                </TableCell>
                <TableCell component="th" scope="row">
                  {stockTypeMap[operation.stockType]}
                </TableCell>
                <TableCell component="th" scope="row">
                  {operation.quantity > 0
                    ? `+${operation.quantity}`
                    : operation.quantity}
                </TableCell>
                <TableCell component="th" scope="row">
                  {operation.reference}
                </TableCell>
                <TableCell component="th" scope="row">
                  {dayjs(operation.created_at).format('DD/MM/YYYY HH:mm')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        labelRowsPerPage="Строк на странице"
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};
