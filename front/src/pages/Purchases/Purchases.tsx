import { useEffect, useState } from 'react';
import { IPurchase } from '../../interfaces';
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
} from '@mui/material';

import { AddButton } from '../../components/AddButton/AddButton';
import { Loader } from '../../components/Loader/Loader';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React from 'react';
import { PurchaseStatus } from '../../enums';
import dayjs from 'dayjs';
import { fetchPurchases } from '../../api/purchases';
import { CreatePurchaseModal } from '../../modals/CreatePurchaseModal/CreatePurchaseModal';

type colors =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning';

const statusDataMap = {
  [PurchaseStatus.Open]: {
    color: 'secondary' as colors,
    text: 'Ожидает поставки',
  },
  [PurchaseStatus.Delivered]: {
    color: 'success' as colors,
    text: 'Доставлен',
  },
};

const Row = ({ purchase }: { purchase: IPurchase }) => {
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment key={purchase.id}>
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
          {purchase.id}
        </TableCell>
        <TableCell>{purchase.number}</TableCell>
        <TableCell>
          <Chip
            label={statusDataMap[purchase.status].text}
            color={statusDataMap[purchase.status].color}
          />
        </TableCell>
        <TableCell>
          {dayjs(purchase.created_at).format('DD/MM/YYYY HH:mm')}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Позиции закупки
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell>Название продукта</TableCell>
                    <TableCell align="right">Ожидаемое количество</TableCell>
                    <TableCell align="right">Доставленное количество</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {purchase.positions.map((position) => (
                    <TableRow key={position.id}>
                      <TableCell component="th" scope="row">
                        {position.id}
                      </TableCell>
                      <TableCell>{position.product.name}</TableCell>
                      <TableCell align="right">{position.expected}</TableCell>
                      <TableCell align="right">{position.delivered}</TableCell>
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

export const Purchases = () => {
  const [purchases, setPurchases] = useState<IPurchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [updateFlag, setUpdateFlag] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchPurchases({
      limit: rowsPerPage,
      offset: page * rowsPerPage,
    }).then((res) => {
      setPurchases(res[0]);
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

  return isLoading ? (
    <Loader />
  ) : (
    <>
      {modalIsOpen && (
        <CreatePurchaseModal
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
              <TableCell align="left">Id</TableCell>
              <TableCell>Номер закупки</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Дата создания</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchases.map((purchase) => (
              <Row purchase={purchase} />
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
