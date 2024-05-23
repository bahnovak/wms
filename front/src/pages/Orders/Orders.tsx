import { useEffect, useState } from 'react';
import { IOrder } from '../../interfaces';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Box,
  Collapse,
  IconButton,
  Typography,
  Chip,
  Tooltip,
} from '@mui/material';

import { AddButton } from '../../components/AddButton/AddButton';
import { Loader } from '../../components/Loader/Loader';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React from 'react';
import {
  approveOrder,
  closeOrder,
  completeOrder,
  fetchOrders,
} from '../../api/orders';
import { CreateOrderModal } from '../../modals/CreateOrderModal/CreateOrderModal';
import { OrderStatus } from '../../enums';
import dayjs from 'dayjs';
import ApproveIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/DoDisturb';
import CompleteIcon from '@mui/icons-material/LocalShipping';
import { useSnackbar } from 'notistack';

type colors =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning';

const statusDataMap = {
  [OrderStatus.Closed]: {
    color: 'warning' as colors,
    text: 'Закрыт',
  },
  [OrderStatus.Completed]: {
    color: 'success' as colors,
    text: 'Отгружен',
  },
  [OrderStatus.Open]: {
    color: 'secondary' as colors,
    text: 'Готов к отгрузке',
  },
  [OrderStatus.InProcessing]: {
    color: 'info' as colors,
    text: 'В обработке',
  },
};

const Row = ({
  order,
  onApprove,
  onClose,
  onComplete,
}: {
  order: IOrder;
  onApprove: (id: number) => void;
  onClose: (id: number) => void;
  onComplete: (id: number) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment key={order.id}>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {order.id}
        </TableCell>
        <TableCell>{order.number}</TableCell>
        <TableCell>{order.address}</TableCell>
        <TableCell>{order.supplier.name}</TableCell>
        <TableCell>
          <Chip
            label={statusDataMap[order.status].text}
            color={statusDataMap[order.status].color}
          />
        </TableCell>
        <TableCell>
          {dayjs(order.created_at).format('DD/MM/YYYY HH:mm')}
        </TableCell>
        <TableCell>
          {order.status === OrderStatus.InProcessing && (
            <Tooltip title="Принять заказ">
              <IconButton
                aria-label="approve"
                size="large"
                onClick={() => onApprove(order.id)}
              >
                <ApproveIcon color="success" />
              </IconButton>
            </Tooltip>
          )}
          {order.status === OrderStatus.Open && (
            <Tooltip title="Завершить заказ">
              <IconButton
                aria-label="complete"
                size="large"
                onClick={() => onComplete(order.id)}
              >
                <CompleteIcon color="success" />
              </IconButton>
            </Tooltip>
          )}
          {[OrderStatus.InProcessing, OrderStatus.Open].includes(
            order.status,
          ) && (
            <Tooltip title="Отклонить заказ">
              <IconButton
                aria-label="close"
                size="large"
                onClick={() => onClose(order.id)}
              >
                <CloseIcon color="error" />
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Позиции заказа
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Идентификатор</TableCell>
                    <TableCell>Название</TableCell>
                    <TableCell align="right">Цена закупки</TableCell>
                    <TableCell align="right">Цена продажи</TableCell>
                    <TableCell align="right">Количество</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.positions.map((position) => (
                    <TableRow key={position.id}>
                      <TableCell component="th" scope="row">
                        {position.id}
                      </TableCell>
                      <TableCell>{position.product.name}</TableCell>
                      <TableCell align="right">
                        {position.product.purchasePrice}
                      </TableCell>
                      <TableCell align="right">{position.salesPrice}</TableCell>
                      <TableCell align="right">{position.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export const Orders = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [updateFlag, setUpdateFlag] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchOrders({
      limit: rowsPerPage,
      offset: page * rowsPerPage,
    }).then((res) => {
      setOrders(res[0]);
      setTotalCount(res[1]);
      setIsLoading(false);
    });
  }, [updateFlag, rowsPerPage, page]);

  const updateCallback = () => setUpdateFlag(!updateFlag);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleApprove = (id: number) => {
    approveOrder(id)
      .then(() => {
        enqueueSnackbar('Успешно', { variant: 'success' });
        updateCallback();
      })
      .catch(() => {
        enqueueSnackbar('Недоствточное количество продуктов', {
          variant: 'error',
        });
      });
  };

  const handleClose = (id: number) => {
    closeOrder(id)
      .then(() => {
        enqueueSnackbar('Заказа отклонен', { variant: 'success' });
        updateCallback();
      })
      .catch(() => {
        enqueueSnackbar('Упс, что-то пошло не так', {
          variant: 'error',
        });
      });
  };

  const handleComplete = (id: number) => {
    completeOrder(id)
      .then(() => {
        enqueueSnackbar('Заказ успешно завершен', { variant: 'success' });
        updateCallback();
      })
      .catch(() => {
        enqueueSnackbar('Упс, что-то пошло не так', {
          variant: 'error',
        });
      });
  };

  return isLoading ? (
    <Loader />
  ) : (
    <>
      {modalIsOpen && (
        <CreateOrderModal
          isOpen={modalIsOpen}
          setIsOpen={setModalIsOpen}
          callback={updateCallback}
        />
      )}
      <TableContainer component={Paper} sx={{ maxHeight: '80%' }}>
        <Table aria-label="collapsible table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="left">Идентификатор</TableCell>
              <TableCell>Номер заказа</TableCell>
              <TableCell>Адрес доставки</TableCell>
              <TableCell>Перевозчик</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Дата создания</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <Row
                order={order}
                onApprove={handleApprove}
                onClose={handleClose}
                onComplete={handleComplete}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        labelRowsPerPage="Строк на странице"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <AddButton onClick={() => setModalIsOpen(true)} />
    </>
  );
};
